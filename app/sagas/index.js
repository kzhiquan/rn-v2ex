

import { fork } from 'redux-saga/effects';

import { watchTest } from './test'
import { watchTopic } from './topic'

export default function* rootSaga(){
	yield[
		fork(watchTest),
		fork(watchTopic)
	]
}