 ;
var React = require('react-native');
var Svg = require('react-native-svg');
var Path = Svg.Path;

var GearIcon = React.createClass({

  render: function(){
    return (
    <Svg width={40} height={40} viewBox="0 0 300 300">
        <Path d="M163.597,32.471l8.955,25.178c6.007,1.741,11.779,4.141,17.142,7.117l24.15-11.478l20.055,20.049  l-11.484,24.136c2.976,5.403,5.382,11.135,7.11,17.169l25.191,8.927v28.374l-25.191,8.954c-1.729,6.021-4.135,11.781-7.11,17.156  l11.484,24.136l-20.055,20.062l-24.15-11.485c-5.375,2.983-11.135,5.383-17.142,7.125l-8.955,25.178h-28.359l-8.962-25.178  c-6.014-1.742-11.773-4.142-17.149-7.125l-24.149,11.485l-20.049-20.062l11.492-24.136c-2.976-5.39-5.39-11.135-7.118-17.156  l-25.178-8.954v-28.374l25.178-8.927c1.728-6.034,4.142-11.78,7.118-17.169L64.928,73.337l20.049-20.049l24.149,11.478  c5.39-2.976,11.135-5.375,17.149-7.117l8.962-25.178H163.597 M149.41,176.407c21.324,0,38.617-17.293,38.617-38.617  s-17.293-38.63-38.617-38.63c-21.331,0-38.631,17.306-38.631,38.63S128.079,176.407,149.41,176.407 M175.616,15.418H163.59h-28.36  h-12.033l-4.046,11.328l-6.185,17.409c-1.336,0.521-2.674,1.069-3.991,1.659L92.3,37.86l-10.875-5.156l-8.517,8.516L52.854,61.255  l-8.516,8.529L49.5,80.66l7.927,16.703c-0.577,1.316-1.125,2.633-1.639,3.963l-17.402,6.199l-11.355,4.018v12.054v28.367v12.062  l11.355,4.024l17.402,6.192c0.514,1.315,1.062,2.66,1.639,3.963L49.5,194.894l-5.163,10.881l8.516,8.523l20.056,20.049l8.517,8.503  l10.875-5.157l16.675-7.933c1.323,0.568,2.654,1.117,3.991,1.639l6.185,17.416l4.046,11.327h12.04h28.359h12.026l4.046-11.327  l6.185-17.416c1.344-0.521,2.675-1.07,3.99-1.639l16.676,7.933l10.875,5.157l8.516-8.503l20.063-20.049l8.516-8.523l-5.17-10.881  l-7.926-16.689c0.576-1.316,1.124-2.647,1.646-3.963l17.402-6.192l11.354-4.024v-12.062v-28.367v-12.054l-11.354-4.018  l-17.402-6.199c-0.521-1.33-1.069-2.661-1.646-3.963l7.926-16.703l5.17-10.875l-8.516-8.529L225.91,41.22l-8.516-8.516L206.52,37.86  l-16.676,7.954c-1.322-0.589-2.646-1.138-3.99-1.659l-6.185-17.409L175.616,15.418L175.616,15.418z M149.41,159.354  c-11.896,0-21.564-9.668-21.564-21.558s9.668-21.571,21.564-21.571c11.883,0,21.551,9.682,21.551,21.571  S161.3,159.354,149.41,159.354L149.41,159.354z"/>
    </Svg>
  );
  }
});
module.exports = GearIcon;
