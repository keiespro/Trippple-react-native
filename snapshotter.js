'use strict';

const React = require('React');
import {StyleSheet, NativeModules, UIManager, View } from 'react-native'
const { TestModule } = NativeModules

import TimerMixin from 'react-timer-mixin'
const requireNativeComponent = require('requireNativeComponent');


const DelayedSnapshotViewIOS = React.createClass({
  mixins: [TimerMixin],
  onDefaultAction(event: Object) {
    const delay = this.props.delay || 1000;

    this.setTimeout(() => TestModule.verifySnapshot(TestModule.markTestPassed), delay);
  },

  render() {
    const testIdentifier = this.props.testIdentifier || 'test';
    const onSnapshotReady = this.props.onSnapshotReady || this.onDefaultAction;
    return (
      <RCTSnapshot
        style={style.snapshot}
        {...this.props}
        onSnapshotReady={onSnapshotReady}
        testIdentifier={testIdentifier}
      />
    );
  },

  propTypes: {
    ...View.propTypes,
    // A callback when the Snapshot view is ready to be compared
    onSnapshotReady : React.PropTypes.func,
    // A name to identify the individual instance to the SnapshotView
    testIdentifier : React.PropTypes.string,
  }
});

const style = StyleSheet.create({
  snapshot: {
  },
});

// Verify that RCTSnapshot is part of the UIManager since it is only loaded
// if you have linked against RCTTest like in tests, otherwise we will have
// a warning printed out
const RCTSnapshot = UIManager.RCTSnapshot ?
  requireNativeComponent('RCTSnapshot', DelayedSnapshotViewIOS) :
  View;

module.exports = DelayedSnapshotViewIOS;
