import 'react-native';
import React from 'react';
import AppNav from '../AppNav.android';
import renderer from 'react-test-renderer';

import mockStore from 'redux-mock-store'


test('renders correctly', () => {
  const store = mockStore()

  const tree = renderer.create(
    <AppNav store={store({ui:{},auth:{}})}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
