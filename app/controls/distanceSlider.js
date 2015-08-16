/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
 ;

var React = require('react-native');
var {
  SliderIOS,
  Text,
  StyleSheet,
  View,
} = React;

var DistanceSlider = React.createClass({
  getInitialState() {
    return {
      value: 0,
    };
  },

  render() {
    return (
      <View
        style={styles.container}
        pointerEvents={'box-none'}
        onMoveShouldSetResponder={()=>{return true}}
        onResponderGrant={()=>{console.log('RESPONDER GRANT')}}
        onStartShouldSetResponderCapture={(e)=>{console.log(e); return true}}
        onMoveShouldSetResponderCapture={(e)=>{console.log(e); return true}}
        onResponderTerminate={()=>{console.log('RESPONDER TERMINATED')}}
        >
        <Text style={styles.text} >
          {this.state.value}
        </Text>
        <SliderIOS
          style={styles.slider}
          pointerEvents={'box-none'}
          minimumValue={10}
          maximumValue={500}
          onValueChange={(value) => this.props.handler(parseInt(value))} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container:{
    height:150,
    flex:1,
    alignSelf:'stretch',
    alignItems:'stretch',
    left:0,
    right:0
  },
  slider: {
    height: 100,
    alignSelf:'stretch',
    flex:1,
    left:0,
    right:0
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
});

module.exports = DistanceSlider;
