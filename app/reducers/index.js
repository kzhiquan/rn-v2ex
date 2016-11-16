

import { combineReducers } from 'redux';
import test from './test';
import topicList from './topicList';
import auth from './auth'
import account from './account'
import topic from './topic'

const rootReducer = combineReducers({
	test,
	topicList,
	topic,
	auth,
	account,
});

export default rootReducer;