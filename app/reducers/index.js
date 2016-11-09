

import { combineReducers } from 'redux';
import test from './test';
import topic from './topic';
import auth from './auth'
import account from './account'

const rootReducer = combineReducers({
	test,
	topic,
	auth,
	account,
});

export default rootReducer;