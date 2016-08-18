import { cardStackReducer } from 'react-native-navigation-redux-helpers';

import Potentials from '../components/screens/potentials/potentials';

const initialState = {
	key: 'global',
	index: 0,
	routes: [
		{
			component: Potentials,
			index: 0,
      key:'p'
		},
	],
};

module.exports = cardStackReducer(initialState);
