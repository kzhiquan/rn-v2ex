
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist';
var {AsyncStorage} = require('react-native');

import rootReducer from '../reducers/index';

const middlewares = [];
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware)

if (process.env.NODE_ENV === 'development'){
	const logger = createLogger();
	middlewares.push(logger);
}

const createV2EXStore = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState, onComplete){

	const store = createV2EXStore(rootReducer, initialState, autoRehydrate());
	persistStore(store, {storage: AsyncStorage}, onComplete);

	//const store = createV2EXStore(rootReducer, initialState);

	store.runSaga = sagaMiddleware.run;
	store.close = () => store.dispatch(END);

	return store;
}