

import { fork } from 'redux-saga/effects';

import { watchTest } from './test'

export default function* rootSaga(){
	yield[
		fork(watchTest)
	]
}