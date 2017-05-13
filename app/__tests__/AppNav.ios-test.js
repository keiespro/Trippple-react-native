import 'react-native';
import React from 'react';
import AppNav from '../AppNav.ios';
import renderer from 'react-test-renderer';
import mockStore from 'redux-mock-store'

test('renders correctly', () => {
  const store = mockStore({})

  const tree = renderer.create(
    <AppNav store={store}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
