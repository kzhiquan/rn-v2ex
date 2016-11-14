

import { fork } from 'redux-saga/effects';

import { watchTest } from './test'
import { watchTopic } from './topic'
import { watchAccount } from './account'
import { watchAuthTopic, watchAuthReply, wathChangeUser } from './auth'

export default function* rootSaga(){
	yield[
		fork(watchTest),
		fork(watchTopic),
		fork(watchAccount),
		fork(watchAuthTopic),
		fork(watchAuthReply),
		fork(wathChangeUser),
	]
}