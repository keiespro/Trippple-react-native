import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Potentials from '../potentials';

it('renders correctly', () => {
  const tree = renderer.create(
    <Potentials />
  ).toJSON();
  expect(tree).toMatchSnapshot();

});
