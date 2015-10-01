// react-native-mask-mixin
// alex lopez
// forked from:
// http://github.com/borbit/react-mask-mixin
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
// Version: 0.0.3X

var MASK_REGEX = {
  '9': /\d/,
  'A': /[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,
  '*': /[\dA-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/
}

var MASK_CHARS = Object.keys(MASK_REGEX)
var PTRN_REGEX = new RegExp('[' + MASK_CHARS.join(',') + ']', 'g')

var ReactMaskMixin = {
  componentWillMount: function() {
    this.mask = {
      props: {
        value: this.props.value,
        onChange: this._onChange,
        onKeyDown: this._onKeyDown,
        onFocus: this._onFocus,
        onBlur: this._onBlur
      },
      empty: true,
      cursorPrev: 0,
      cursor: 0
    }
    if (this.props.value && this.props.mask) {
      this.processValue(this.props.value)
    }
  },

  processValue: function(value) {
    if(value.length > this.props.mask.length){
      return false;
    }
    var mask = this.props.mask
    var pattern = mask.replace(PTRN_REGEX, '\u2007')
    var rexps = {}

    mask.split('').forEach(function(c, i) {
      if (~MASK_CHARS.indexOf(c)) {
        rexps[i+1] = MASK_REGEX[c]
      }
    })

    var cursorMax = 0
    var cursorMin = 0
    var newValue = ''
    var nextChar

    for (i = 0; i < mask.length; i++) {
      if (~MASK_CHARS.indexOf(mask[i])) {
        cursorMin = i
        break
      }
    }

    for (var i = 0, j = 0; i < mask.length;) {
      if (!~MASK_CHARS.indexOf(mask[i])) {
        newValue += mask[i]
        if (mask[i] == value[j]) {
          j++
        }
        i++
      } else {
        if (nextChar = value.substr(j++, 1)) {
          if (rexps[newValue.length+1].test(nextChar)) {
            newValue += nextChar
            cursorMax = newValue.length
            i++
          }
        } else {
          newValue = newValue.substr(0, cursorMax)
          newValue += pattern.slice(cursorMax)
          break
        }
      }
    }


    var cursorPrev = this.mask.cursor
    var cursorCurr;
    //UGLY:
    if(cursorPrev == 3 && cursorMax == 4){
      cursorCurr = 6
    }else if(cursorPrev == 8 && cursorMax == 9){
      cursorCurr = 10

    }else{
      cursorCurr = cursorMax
    }
    // EDITED from setSelectionRange : 0
    var maskedValue = newValue;

    newValue = newValue.substr(0, cursorCurr)

    var removing = this.mask.cursor > cursorCurr
    cursorMax = Math.max(cursorMax, cursorMin)

    if (cursorCurr <= cursorMin) {
      cursorCurr = cursorMin
    } else if (cursorCurr >= cursorMax) {
      cursorCurr = cursorMax
    } else if (removing) {
      for (var i = cursorCurr; i >= 0; i--) {
        cursorCurr = i
        if (rexps[i] && !rexps[i+1]) break
        if (rexps[i] && rexps[i+1] && rexps[i+1].test(newValue[i])) {
          break
        }
      }
    } else {
      for (var i = cursorCurr; i <= cursorMax; i++) {
        cursorCurr = i
        if (!rexps[i+1] && rexps[i]) break
        if (rexps[i+1] && rexps[i+1].test(newValue[i])) {
          if (!rexps[i]) {
            cursorCurr++
          }
          break
        }
      }
    }

    this.mask.empty = cursorMax == cursorMin
    this.mask.props.value = newValue
    this.mask.props.fullValue = maskedValue
    this.mask.cursor = cursorCurr

    var phone = this.mask.props.value.replace(/[\. ,():-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'')
    console.log(phone)

    if (this.props.onChange) {
      this.props.onChange(phone)
    }
  },
  _forceUpdate: function(){
    this.setNativeProps({
      text: this.mask.props.value
  })


  },
  setNativeProps(np) {
    this._textInput.setNativeProps(np);
  },

  _onBlur: function(e) {
    // if (this.props.mask) {
    //   var cursor = this.mask.cursor
    //   var value = this.mask.props.value
    //
    //   if (!this.mask.empty) {
    //     this.mask.props.value = value.substr(0, cursor)
    //   } else {
    //     this.mask.props.value = ''
    //   }
    //
    // }
    // if (this.props.onBlur) {
    //   this.props.onBlur(e)
    // }
  },

  _onChange: function(event) {
    if (this.props.mask) {
      this.processValue(event.nativeEvent.text)
      // this.setNativeProps({text:event.nativeEvent.text})
      //
      // if(this.mask.props.value && this.mask.props.value.length == 3){
      //   this._textInput.focus()
      //
      //   console.log('_onChange',this.mask.props)
      // }
      //


    }

  },


  // _onFocus: function(e) {
  //   // this._onChange(e)
  //   if (this.props.onFocus) {
  //     this.props.onFocus(e)
  //   }
  // },

}

module.exports = ReactMaskMixin;
