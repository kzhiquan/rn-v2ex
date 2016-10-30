
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import createLogger from 'redux-logger';

import rootReducer from '../reducers/index';

const middlewares = [];
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware)

if (process.env.NODE_ENV === 'development'){
	const logger = createLogger();
	middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState){
	const store = createStoreWithMiddleware(rootReducer, initialState);

	store.runSaga = sagaMiddleware.run;
	store.close = () => store.dispatch(END);

	return store;
}