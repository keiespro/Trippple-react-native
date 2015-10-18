import s from 'underscore.string'

const mask = '(999) 999-9999',
    emptyMask = `(\u2007\u2007\u2007)\u2007\u2007\u2007\u2007-\u2007\u2007\u2007\u2007`,
    maskMap = [
      {
        position: 0,
        char: '('
      },
      {
        position: 4,
        char: ')'
      },
      {
        position: 5,
        char: ' '
      },
      {
        position: 9,
        char: '-'
      },
    ],
    maskArr= ['(',')',' ','-'];

var formatPhone = (p)=>{
  var sanitizedText = (p+'')
      .replace(/[\. ,():+-]+/g, '')
      .replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');

  return maskMap.reduce( (phone, mapChar, index) => {
    return (mapChar.position <= phone.length ? s.insert(phone,mapChar.position,mapChar.char) : phone)
  },sanitizedText)
}
export default formatPhone
