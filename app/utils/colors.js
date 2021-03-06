import config  from '../../config'
const { invertColors } = config


function invert( rgb ){
  rgb = Array.prototype.join.call( arguments )
    .match( /(-?[0-9\.]+)/g );
  for ( var i = 0; i < rgb.length; i++ )
  {
    rgb[ i ] = ( i === 3 ? 1 : 255 ) - rgb[ i ];
  }
  return rgb;
}

const colors = {
  transparent: 				'rgba(0,0,0,0)',

  rollingStone:       'rgb(120,129,135)', // #788187

  mediumPurple:       'rgb(132, 89, 218)', //#8459DA

  mediumPurple20:     'rgba(132,89,218,0.20)',

  darkPurple:         'rgb(105,57,200)',

	brightPurple:				'rgba(130,42,254,1)',

  white:              'rgb(255,255,255)',

  whiteAnimate:       'rgba(255,255,255,1)',

  white20:            'rgba(255,255,255,0.20)',

  offwhite:           'rgba(255,255,255,0.70)',

  shuttleGray:        'rgb(86,96,103)',

  shuttleGrayAnimate: 'rgba(86,96,103,1.0)',

  shuttleGray20:      'rgba(86,96,103,.20)',

	steelGrey:        	'rgba(120,129,135,1.0)',

  steelGrey20:        'rgba(120,129,135,0.20)',

  outerSpace:         'rgb(44,57,65)', // #2C3941

  outerSpace50:       'rgba(44,57,65,0.5)',

	outerSpace70:       'rgba(44,57,65,0.7)',

  outerSpaceAnimate:  'rgba(44,57,65,1.0)',

  outerSpace20:       'rgba(44,57,65,0.2)',

  darkGreenBlue:      'rgb(25,105,66)',

  darkGreenBlue40:    'rgba(25, 104, 65, 0.40)',

  sushi:              'rgb(66,181,125)',

  sashimi:            'rgba(33,120,77,1)',

  atlantis:           'rgb(129,209,53)',

  mandy:              'rgb(232,74,107)', //#E84A6B

  darkishPink20:      'rgba(232,73,107,0.20)',

  darkSkyBlue:        'rgb(65,182,225)',

  darkSkyBlue20:      'rgba(65,182,225,0.20)',

  dusk:               'rgb(61,63,96)',

  warmGrey:           'rgb(151,151,151)',

  warmGreyTwo:         'rgb(154, 154, 154)',

  darkShadow:         'rgba(0,0,0,.45)',

  dark:               'rgb(36,49,56)',

  lavender:           'rgb(179, 152, 232)',

  sapphire50:         'rgba(71,36,143,0.50)',

  dandelion:          'rgb(255,233,0)',

  dandelion0:         'rgba(255,233,0,0.00)',

  dandelion100:       'rgba(255,233,0,1.00)',
  cornFlower:         'rgba(63, 115, 219, 1.00)',
  cornFlower20:  'rgba(63, 115, 219, 0.20)',
}


const invertedColors = Object.keys( colors ) .reduce( ( acc, el, i ) => {

    let invertedArray = invert( colors[ el ] );
    acc[ el ] = ( invertedArray.length == 3 ? `rgb(${invertedArray})` : `rgba(${invertedArray})` );
    return acc

}, {} );


export default ( invertColors !== true ? colors : invertedColors )
