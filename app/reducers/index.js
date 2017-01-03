

import { combineReducers } from 'redux';
import test from './test';
import topicList from './topicList';
import auth from './auth';
import account from './account';
import topic from './topic';
import node from './node';
import user from './user';
import search from './search';
import newTopic from './newTopic';
import recent from './recent';

const rootReducer = combineReducers({
	test,
	topicList,
	topic,
	auth,
	//account,
	node,
	user,
	search,
	newTopic,
	recent,
});

export default rootReducer;