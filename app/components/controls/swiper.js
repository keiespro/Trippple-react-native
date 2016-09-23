import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native'
import TimerMixin from 'react-timer-mixin'
import colors from '../../utils/colors'

const { width, height } = Dimensions.get('window')

/**
 * Default styles
 * @type {StyleSheetPropType}
 */
const styles = StyleSheet.create({
    grayDot: {
        backgroundColor: colors.shuttleGray,
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 2,
        marginBottom: 2,
        borderColor: colors.shuttleGray
    },
    dot15: {
        backgroundColor: 'transparent',
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 2,
        borderColor: colors.white
    },
    activeDot15:{
        borderColor: colors.mediumPurple,
        backgroundColor: colors.mediumPurple,

    },

    activeDot16: {
        backgroundColor: colors.mediumPurple,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 2,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: colors.mediumPurple
    },
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
    },

    wrapper: {
        backgroundColor: 'transparent',
        alignItems:'center',justifyContent:'center',
    },

    slide: {
        backgroundColor: 'transparent',
    },

    pagination_x: {
        position: 'absolute',
        bottom: 200,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
    },

    pagination_y: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
    },
})

const Swiper = React.createClass({


    mixins: [TimerMixin],

  /**
   * Default props
   * @return {object} props
   * @see http://facebook.github.io/react-native/docs/scrollview.html
   */
    getDefaultProps() {
        return {
            horizontal                       : true,
            pagingEnabled                    : true,
            showsHorizontalScrollIndicator   : false,
            showsVerticalScrollIndicator     : false,
            bounces                          : false,
            scrollsToTop                     : false,
            removeClippedSubviews            : true,
            automaticallyAdjustContentInsets : false,
            showsPagination                  : true,
            showsButtons                     : false,
            loop                             : true,
            autoplay                         : false,
            autoplayTimeout                  : 2.5,
            autoplayDirection                : true,
            index                            : 0,
        }
    },

  /**
   * Init states
   * @return {object} states
   */
    getInitialState() {
        let props = this.props

        let initState = {
            isScrolling: false,
            scroll: new Animated.Value(0),
            autoplayEnd: false,
        }

        initState.total = props.children ? (props.children.length || 1) : 0

        initState.index = initState.total > 1 ? props.index || 0 : 0

    // Default: horizontal
        initState.dir = props.horizontal == false ? 'y' : 'x'
        initState.width = props.width || width
        initState.height = props.height || height
        initState.offset = {}

        if(initState.total > 1) {
            let setup = props.loop ? 1 : initState.index
            initState.offset[initState.dir] = initState.dir == 'y' ? initState.height * setup : initState.width * setup
        }

        return initState
    },


  // componentWillMount() {
  // },

    componentDidMount() {
    // this.state.scroll.addListener((e)=>{
    // })
    },

    /**
   * Scroll begin handle
   * @param  {object} e native event
   */
    onScrollBegin(e) {
    // update scroll state

        this.setImmediate(() => {
            this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e, this.state, this)
        })
    },

  /**
   * Scroll end handle
   * @param  {object} e native event
   */
    onScrollEnd(e) {

    // update scroll state

        this.updateIndex(e.nativeEvent.contentOffset, this.state.dir)

    // Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
    // in setTimeout to ensure synchronous update `index`
    // this.setImmediate(() => {
      // this.autoplay()

      // if `onMomentumScrollEnd` registered will be called here
        this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e, this.state, this)
    // })
    },

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   * @param  {string} dir    'x' || 'y'
   */
    updateIndex(offset, dir) {

        let state = this.state
        let index = state.index
        let diff = offset[dir] - state.offset[dir]
        let step = dir == 'x' ? state.width : state.height
    // Do nothing if offset no change.
        if(!diff) return

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
        index = index + diff / step

        if(this.props.loop) {
            if(index <= -1) {
                index = state.total - 1
                offset[dir] = step * state.total
            }
            else if(index >= state.total) {
                index = 0
                offset[dir] = step
            }
        }

        this.setState({
            index: index,
            offset: offset,
        })
    },

  /**
   * Scroll by index
   * @param  {number} index offset index
   */
    scrollTo(index) {
        if(this.state.isScrolling) return
        let state = this.state
        let diff = (this.props.loop ? 1 : 0) + index + this.state.index
        let x = 0
        let y = 0
        if(state.dir == 'x') x = diff * state.width
        if(state.dir == 'y') y = diff * state.height
        this.refs.scrollView && this.refs.scrollView.scrollTo(y, x)
    },

  /**
   * Render pagination
   * @return {object} react-dom
   */
    renderPagination() {

    // By default, dots only show when `total` > 2
        if(this.state.total <= 1 || this.props.inCard && !this.props.profileVisible) return null

        return (
      <View>
        {React.Children.map(this.props.children, (c,i) => {
            return (
            <View
                pointerEvents={'box-none'}
                style={[styles['pagination_' + this.state.dir], this.props.paginationStyle]}
            >
              <View style={this.props.grayDots ? styles.grayDot : styles.dot} key={'dot'+i} />
            </View>
          )
        })}


      </View>
    )
    },

  //
  // componentWillReceiveProps(nProps){
  //   // if(nProps.activeIndex != this.props.activeIndex){
  //   //   this.scrollTo(nProps.activeIndex+this.state.index);
  //   // }
  // },

  /**
   * Default render
   * @return {object} react-dom
   */
    render() {
        let state = this.state
        let props = this.props
        let children = props.children
        let index = state.index
        let total = state.total
        let loop = props.loop
        let dir = state.dir
        let key = 0

        let pages = []
        let pageStyle = [{width: state.width, height: state.height}, styles.slide]

    // For make infinite at least total > 1
        if(total > 1) {

      // Re-design a loop model for avoid img flickering
            pages = Object.keys(children)
            if(loop) {
                pages.unshift(total - 1)
                pages.push(0)
            }

            pages = pages.map((page, i) => {

                return <View style={pageStyle} key={i+'slidepot'}>{children[page]}</View>
            }
      )
        }
        else{
            pages = <View style={pageStyle} key={'xslidepot'}>{children}</View>
        }

    // For the WELCOME slider
        let inputRange = [0,0,width,width*2,width*3,width*4,width*5,width*6],
            outputRange = [-64,64,-64,-32,0,32,64,-64];

        let inputRangeVertical = [0,height,height*2,height*3],
            outputRangeVertical = [0,27,0,27];



        return (
      <Animated.View
          style={[styles.container, {
              alignItems:'center',justifyContent:'center',
              width: props.width,
              height: props.height,
              opacity: this.props.pan && this.props.isTopCard ? this.props.pan.x.interpolate({
                  inputRange: [-300, -80, -10, 0, 10, 80, 300],
                  outputRange: [0, .5, 1, 1, 1, .5, 0]
              }) : 1,
          }]}
      >
        <ScrollView ref="scrollView"
            {...props}
            scrollEnabled={props.profileVisible}
            scrollEventThrottle={16}
            pagingEnabled={true}
            contentOffset={state.offset}
            centerContent={true}
            contentContainerStyle={[styles.wrapper, props && props.style]}
            onScrollBeginDrag={this.onScrollBegin}
            onMomentumScrollEnd={this.onScrollEnd}
        >
          {pages}
        </ScrollView>

        <View pointerEvents={'box-none'} style={[styles['pagination_' + this.state.dir], props.paginationStyle,{backgroundColor:colors.spacegray20}]}>
          {(props.showsPagination && !props.inCard) || (props.inCard && props.profileVisible) ? React.Children.map(props.children, (c,i) => {
              return (<View
                  style={ [(props.grayDots ? styles.grayDot : styles.dot15),
                  (index == i ? props.grayDots ? styles.activeDot16 : styles.activeDot15 : null)]}
                  key={'swiperdot'+i}
                      />)
          }) : <View/>}
          </View>
      </Animated.View>
    )
    }
})
export default Swiper
