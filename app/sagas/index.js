

import { fork } from 'redux-saga/effects';

import { watchTest } from './test';
import { watchTopicList } from './topicList';
import { watchTopic } from './topic';
import { watchAccount } from './account';
import { watchAuthTopic, watchAuthReply, wathChangeUser } from './auth';
import { watchNodeList } from './nodeList';
import { watchUser } from './user'

export default function* rootSaga(){
	yield[
		fork(watchTest),
		fork(watchTopicList),
		fork(watchTopic),

		fork(watchAccount),
		fork(watchAuthTopic),
		fork(watchAuthReply),
		fork(wathChangeUser),
		
		fork(watchNodeList),
		fork(watchUser),
	]
}