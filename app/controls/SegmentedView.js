import React from 'react-native';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    PropTypes,
    Easing,
    Animated
} from 'react-native';

const DeviceWidth = require('Dimensions').get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
    },
    title: {
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingVertical: 10,
    },
    spacer: {
        flex: 1,
    },
    barContainer: {
        height: 4,
        position: 'relative',
    },
    bar: {
        backgroundColor: 'blue',
        position: 'absolute',
        height: 4,
    }
});


class SegmentedView extends React.Component{

    static propTypes = {
        duration: PropTypes.number,
        onTransitionStart: PropTypes.func,
        onTransitionEnd: PropTypes.func,
        onPress: PropTypes.func,
        renderTitle: PropTypes.func,
        titles: PropTypes.array,
        index: PropTypes.number,
        barColor: PropTypes.string,
        barPosition: PropTypes.string,
        underlayColor: PropTypes.string,
        stretch: PropTypes.bool,
        selectedTitleStyle: PropTypes.object,
        titleStyle: PropTypes.object,

    }

    static defaultProps = {
      duration: 200,
      onTransitionStart: ()=>{},
      onTransitionEnd: ()=>{},
      onPress: ()=>{},
      renderTitle: null,
      index: 0,
      barColor: '#44B7E1',
      barPosition:'top',
      underlayColor: '#CCCCCC',
      stretch: false,
      selectedTextStyle: null,
      textStyle: null,
    }

    constructor(props) {
      super()

      this.state = {
        barPosition: new Animated.Value(0),
        titleWidth: DeviceWidth / props.titles.length
      }
    }

    componentDidMount() {
      this.state.barPosition.setValue(0);
    }

    componentWillReceiveProps(nextProps) {
        this.moveTo(nextProps.index);
    }

    moveTo(index) {
      Animated.timing( this.state.barPosition,
        {
          duration: 300,
          toValue: this.state.titleWidth * index,
          easing: Easing.inOut(Easing.ease)
        }
      ).start();
    }

    _renderTitle(title, i) {
        return (
            <View style={styles.title}>
                <Text style={[this.props.titleStyle, i === this.props.index && this.props.selectedTitleStyle]}>{title}</Text>
            </View>
        );
    }

    renderTitle(title, i) {
        return (
            <View key={`title-${i}`} ref={`title${i}`} style={{ flex: this.props.stretch ? 1 : 0 }}>
                <TouchableHighlight underlayColor={this.props.underlayColor} onPress={() => this.props.onPress(i)}>
                    {this.props.renderTitle ? this.props.renderTitle(title, i) : this._renderTitle(title, i)}
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        let items = [];
        let titles = this.props.titles;

        if (!this.props.stretch) {
            items.push(<View key={`s`} style={styles.spacer} />);
        }

        for (let i = 0; i < titles.length; i++) {
            items.push(this.renderTitle(titles[i], i));
            if (!this.props.stretch) {
                items.push(<View key={`s${i}`} style={styles.spacer} />);
            }
        }
        let barContainer = (
          <View style={styles.barContainer}>
              <Animated.View ref="bar" style={[styles.bar, {
                  left: this.state.barPosition,
                  width: this.state.titleWidth,
                  backgroundColor: this.props.barColor
              }]} />
          </View>
        );
        return (
            <View {...this.props} style={[styles.container, this.props.style]}>
                {this.props.barPosition === 'top' && barContainer}
                <View style={styles.titleContainer}>
                    {items}
                </View>
                {this.props.barPosition === 'bottom' && barContainer}
            </View>
        );
    }
}

export default SegmentedView
