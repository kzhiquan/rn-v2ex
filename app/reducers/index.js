

import { combineReducers } from 'redux';
import test from './test';
import topicList from './topicList';
import auth from './auth'
import account from './account'
import topic from './topic'
import nodeList from './nodeList'
import user from './user'

const rootReducer = combineReducers({
	test,
	topicList,
	topic,
	auth,
	account,
	nodeList,
	user,
});

export default rootReducer;