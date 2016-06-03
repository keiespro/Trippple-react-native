import React, {PropTypes, Component} from "react";

import { requireNativeComponent, } from "react-native";

class BlurView extends Component {
  render() {
    return <NativeBlurView {...this.props} />;
  }
}

BlurView.propTypes = {
  blurType: React.PropTypes.string,
};

const NativeBlurView = requireNativeComponent('BlurView', BlurView);

module.exports = BlurView;
