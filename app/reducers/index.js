

import { combineReducers } from 'redux';
import test from './test';
import topic from './topic';

const rootReducer = combineReducers({
	test,
	topic
});

export default rootReducer;