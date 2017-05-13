import 'react-native';
import React from 'react';
import AppContainer from '../AppContainer';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import mockStore from 'redux-mock-store'

test('renders correctly', () => {
  const store = mockStore()

  const tree = renderer.create(
    <AppContainer store={store({})}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
