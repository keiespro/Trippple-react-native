
        export default {
            CpsA: CpsA,
            AsyncA: AsyncA,
            EventA: EventA,
            SimpleEventA: SimpleEventA,
            slowBubbleSortA,
            fastBubbleSortA,
            Repeat: Repeat,
            Done: Done,
            ConstA: ConstA
        }

        Function.prototype.A = function A () { /* arr */
            return this;
        };

        Function.prototype.next = function next (g) { /* f >>> g */
            var f = this, g = g.A();
            return function (x) {
                return g(f(x));
            }
        };


        function CpsA(cps) { /* cps :: (x, k) -> () */
            this.cps = cps;
        }

        CpsA.prototype.CpsA = function () {/* identity */
            return this;
        };

        CpsA.prototype.next = function (g) {/* f >>> g  */
            var f = this, g = g.CpsA();

            return new CpsA(function (x,k) {
                f.cps(x, function (y) {
                    g.cps(y, k);
                })
            });
        };

        CpsA.prototype.run = function (x) {
            this.cps(x, function (y) {
                /* ignored */
            });
        };

        Function.prototype.CpsA = function () { /* lifting */
            var f = this;
            /* wrap f in CpsA style function */
            return new CpsA(function (x, k) {
                k(f(x));
            });
        };

        //- Serial Events w/ Arrows
        function SimpleEventA(eventName) {
            if (!(this instanceof SimpleEventA))
                return new SimpleEventA(eventName);
            this.eventName = eventName;
        }

        SimpleEventA.prototype = new CpsA(function(target, k) {
            var f = this;
            function handlerDidFire(event) {
                target.removeListener(f.eventName, handlerDidFire, false);
                k(event);
            }
            target.addListener(f.eventName, handlerDidFire, false);
        });


        /*
          - pure function
          - cps function (a function that controls what it does after its applied, can be used to set up futures, callbacks, event listeners, etc)
          - Simple Event Arrow
          - Full Asynchronous Arrow
        */

        function AsyncA(cps) { /* cps :: (x, p, k) -> () */
            this.cps = cps;
        }

        AsyncA.prototype.AsyncA = function () {
            return this;
        };

        AsyncA.prototype.next = function (g) { /* f >>> g */
            var f = this, g = g.AsyncA();
            return new AsyncA(function(x, p, k) {
                f.cps(x,p, function(fx, px) {
                    g.cps(fx, px, k);
                })
            })
        };

        AsyncA.prototype.run = function (x, p) {
            var f = this;
            p = p || new ProgressA();
            f.cps(x, p, function () {});
            return p; //- once the computation has started,
            //- we leak the progress arrow, so we can halt computation later.
        };

        AsyncA.prototype.bind = function (g) {
            var f = this; g = g.AsyncA();
            return new AsyncA(function (x, p, k) {
                f.cps(x,p, function (fx, q) {
                    g.cps(fx,q,k);
                });
            });
        };

        AsyncA.prototype.repeat = function (interval) {
            var f = this;
            return new AsyncA(function rep (x, p, k) {
                f.cps(x, p, function (y, q) {
                    if (y.Repeat) {
                        function cancel(id) { clearTimeout(tid) }

                        q.addCanceller(cancel);

                        var tid = setTimeout(function() {
                            q.advance(cancel);
                            rep(y.value, q, k);
                        }, interval || 0);

                    } else if (y.Done)
                        k(y.value, q);
                    else
                        throw new TypeError("Repeat or Done");
                });
            });
        };

        AsyncA.prototype.product = function (g) {
            var f = this; g = g.AsyncA();
            return new AsyncA(function (x, p, k) {
                var out1, out2, c =2;
                function barrier() {
                    if (--c == 0) k(Pair(out1,out2), p);
                }

                f.next(function( fx){
                    out1 = fx; barrier();
                }).run(x.fst, p);

                g.next(function( gx) {
                    out2 = gx; barrier();
                }).run(x.snd, p);
            });
        };

        AsyncA.prototype.or = function (g) {
            var f = this; g= g.AsyncA();
            return new AsyncA(function (x, p, k) {
                /* one progress arr for each branch */
                var p1 = new ProgressA();
                var p2 = new ProgressA();

                /* these progress arrows cancel one another once they've advanced */
                p1.next(function() {
                    p2.cancel();
                    p2 = null;
                }).run();

                p2.next(function() {
                    p1.cancel();
                    p1 = null;
                }).run();

                function cancel() {
                    if (p1) p1.cancel();
                    if (p2) p2.cancel();
                }

                /* prepare callback */
                function join(y,q) {
                    p.advance(cancel);
                    k(y, q);
                }

                /* run both */
                p.addCanceller(cancel); /* this ensures the outer progress arrow (p) can still be used to cancel this nested or */

                /* sequence both operations, whoever makes it to join first wins */
                f.cps(x, p1, join);
                g.cps(x, p2, join);
            });
        };

        Function.prototype.repeat = function (interval) {
            return this.AsyncA().repeat(interval);
        };

        function Repeat(x) {
            return {Repeat: true, value: x};
        }

        function Done(x) {
            return {Done: true, value: x};
        }

        Function.prototype.AsyncA = function () { /* lifting */
            var f = this;
            return new AsyncA(function (x, p, k) {
                k(f(x), p)
            })
        };

        function ConstA(x) {
            return function (y) { return x }.AsyncA();
        }

        function ProgressA() {
            if (!(this instanceof ProgressA))
                return new ProgressA();
            this.cancellers = [];
            this.observers = [];
        }

        ProgressA.prototype = new AsyncA(function (x,p,k) {
            this.observers.push(function(y) {
                k(x,p);
            })
        });

        ProgressA.prototype.addCanceller = function (canceller) {
            this.cancellers.push(canceller);
        };

        ProgressA.prototype.advance = function (canceller) {
            var index = this.cancellers.indexOf(canceller);
            if (index >= 0) this.cancellers.splice(index,1);
            while(this.observers.length > 0)
                this.observers.pop()(); //- NOTE the application
        };

        ProgressA.prototype.cancel = function () {
            while(this.cancellers.length > 0)
                this.cancellers.pop()();
        };


        function EventA(eventName) {
            if (!(this instanceof EventA))
                return new EventA(eventName);
            this.eventName = eventName;
        }

        EventA.prototype = new AsyncA(function (target, p,  k) {
            var f = this;
            p.addCanceller(cancel);
            target.addListener(f.eventName, eventDidFire, false);

            function eventDidFire(event) {
                //-event Fired.
                //-move the progress arrow forward, no need to listen for `cancel` any longer
                p.advance(cancel);
                cancel(); //- cleanup
                k(event, p); //- k is this the only way information flows out of this state machine
            }

            function cancel() {
                target.removeListener(f.eventName, eventDidFire, false);
            }
        });

        ////////////////////////////////////////////////////
        // setTimeout(function () {                       //
        //     return                                     //
        //     var p = EventA('blurb')                    //
        //         .next(dataInA)                         //
        //         .next(EventA('blurb'))                 //
        //         .next(dataInA)                         //
        //         .next(function (y) {                   //
        //         })                                     //
        //         .run(target);                          //
        //                                                //
        //     setTimeout(function () {                   //
        //         p.cancel();                            //
        //     },3000);                                   //
        // },1000);                                       //
        ////////////////////////////////////////////////////

        //- buble sort
        var BubbleSortHelperA = function (x) {
            var i = x.i, j = x.j , xs = x.xs;
            if (j + 1 < i) {
                if (xs[j] > xs[j+1]) {
                    var x= xs[j]
                    xs[j] = xs[j+1];
                    xs[j+1] =x;
                }
                return Repeat({i: i, j: j+1, xs: xs}); //- swap positions, and continue
            } else if (i > 0) {
                return Repeat({i: i - 1, j: 0, xs: xs}); //- list
            } else {
                return Done(xs);
            }
        }.AsyncA()


        var slowBubbleSortA = BubbleSortHelperA.repeat(300); //
        var fastBubbleSortA = BubbleSortHelperA.repeat(100); //
                                                             //
        /////////////////////////////////////////////////////////////
        // slowBubbleSortA.next(function (list) {               // //
        // }).or( fastBubbleSortA.next(function (list) {        // //
        /////////////////////////////////////////////////////////////
        //})).run({i: 10, j: 0, xs: [9,8,7,6,5,4,3,2,1,20]});  //
