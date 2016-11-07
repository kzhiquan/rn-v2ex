

import { combineReducers } from 'redux';
import test from './test';
import topic from './topic';
import auth from './auth'

const rootReducer = combineReducers({
	test,
	topic,
	auth
});

export default rootReducer;