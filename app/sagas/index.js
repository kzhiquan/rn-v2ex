

import { fork } from 'redux-saga/effects';

import { watchTest } from './test';
import { watchTopicList } from './topicList';
import { 
	watchTopic, 
	watchFavoriteTopic,
	watchThankTopic, 
	watchReplyTopic,
	watchThankReply, 
} from './topic';

import { watchAccount } from './account';
import { 
	watchAuthTopic, 
	watchAuthReply, 
	wathChangeUser 
} from './auth';

import { watchNodeList } from './nodeList';

import { 
	watchUser, 
	watchUserTopicList,
	watchUserReplyList 
} from './user'


import { watchSearch } from './search';

export default function* rootSaga(){
	yield[
		fork(watchTest),
		fork(watchTopicList),

		fork(watchTopic),
		fork(watchFavoriteTopic),
		fork(watchThankTopic),
		fork(watchReplyTopic),
		fork(watchThankReply),

		fork(watchAccount),
		fork(watchAuthTopic),
		fork(watchAuthReply),
		fork(wathChangeUser),
		
		fork(watchNodeList),

		fork(watchUser),
		fork(watchUserTopicList),
		fork(watchUserReplyList),

		fork(watchSearch),
	]
}