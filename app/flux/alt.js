import Alt from 'alt'

const alt = new Alt();
if(__DEV__){
  window.alt = alt;
  Alt.debug('alt', alt);
}
export default alt
