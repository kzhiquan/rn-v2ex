
import { put, take, call, fork } from 'redux-saga/effects'

import * as types from '../constants/ActionTypes';
import { testA, testB } from '../actions/test';


export function* test_a(){
	try{
		
		//yield put(testA());
		yield put(testB());
		//yield put(setTimeout(function(){testB()}), 1000);

	} catch ( error ){

		console.log('error:', error);
	}
}



export function* watchTest(){
	while (true) {
		yield take(types.TEST_A);
		yield fork(test_a);
	}
}