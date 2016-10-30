
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import { View, Text } from 'react-native'


import rootSaga from './sagas/index'
import App from './containers/App'

const store = configureStore();

store.runSaga(rootSaga);

const V2ex = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

export default V2ex;