
var target = UIATarget.localTarget();


UIATarget.localTarget().frontMostApp().logElementTree()


function phoneEntry(){
var app = UIATarget.localTarget().frontMostApp();

var CurrentScreen = app.mainWindow().images()[0].images()[0];

CurrentScreen[" LOG IN"].tapWithOptions({tapOffset:{x:0.51, y:0.31}});
CurrentScreen.elements().firstWithName("  3").tapWithOptions({tapOffset:{x:0.55, y:0.67}});
CurrentScreen.elements().firstWithName("  0").tapWithOptions({tapOffset:{x:0.54, y:0.38}});
CurrentScreen.elements().firstWithName("  5").tapWithOptions({tapOffset:{x:0.75, y:0.56}});
CurrentScreen.elements().firstWithName("  5").tapWithOptions({tapOffset:{x:0.64, y:0.51}});
CurrentScreen.elements().firstWithName("  2").tapWithOptions({tapOffset:{x:0.62, y:0.45}});
CurrentScreen.elements().firstWithName("  8").tapWithOptions({tapOffset:{x:0.45, y:0.55}});
CurrentScreen.elements().firstWithName("  2").tapWithOptions({tapOffset:{x:0.27, y:0.44}});
CurrentScreen.elements().firstWithName("  5").tapWithOptions({tapOffset:{x:0.50, y:0.73}});
CurrentScreen.elements().firstWithName("  3").tapWithOptions({tapOffset:{x:0.64, y:0.36}});
CurrentScreen.elements().firstWithName("  4").tapWithOptions({tapOffset:{x:0.66, y:0.69}});
CurrentScreen.elements()["  CONTINUE"].tapWithOptions({tapOffset:{x:0.86, y:0.39}});

}


function onboard(){

var app = UIATarget.localTarget().frontMostApp();

app.mainWindow().elements()["    TRIPPPLE FOR SINGLES"].tapWithOptions({tapOffset:{x:0.70, y:0.36}});
app.mainWindow().elements()[" No thanks"].tapWithOptions({tapOffset:{x:0.71, y:0.30}});
app.mainWindow().scrollViews()[0].textFields()[0].tap();
app.keyboard().typeString("Human");
app.mainWindow().elements()[16].tapWithOptions({tapOffset:{x:0.91, y:-12.15}});
app.mainWindow().pickers()[0].wheels()[2].scrollToVisible();
app.mainWindow().scrollViews()[0].dragInsideWithOptions({startOffset:{x:0.81, y:1.60}, endOffset:{x:0.88, y:0.94}});
app.mainWindow().pickers()[0].wheels().firstWithPredicate("value like '1985'").scrollToVisible();
app.mainWindow().elements()[2].tapWithOptions({tapOffset:{x:0.38, y:0.52}});
app.mainWindow().elements()["  MALE"].tapWithOptions({tapOffset:{x:0.20, y:0.62}});
app.mainWindow().elements()[4].tapWithOptions({tapOffset:{x:0.43, y:0.36}});
app.mainWindow().elements()["   PUBLIC Your profile is visible to all Trippple members"].tapWithOptions({tapOffset:{x:0.19, y:0.60}});
app.mainWindow().elements()[5].tapWithOptions({tapOffset:{x:0.38, y:0.63}});
app.mainWindow().elements()[" FROM ALBUM"].tapWithOptions({tapOffset:{x:0.41, y:0.54}});
app.mainWindow().scrollViews()[1].elements()[1].tapWithOptions({tapOffset:{x:0.40, y:0.43}});
app.mainWindow().elements()[2].tapWithOptions({tapOffset:{x:0.74, y:0.86}});

}
