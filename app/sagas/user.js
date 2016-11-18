import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveUser } from '../actions/user';
import { fetchUser } from '../utils/SiteUtil'



function* fetchUserSagas(path){
	try{

		const userReceived = yield call(fetchUser, path); 
		console.log('userReceived:', userReceived);

		if( typeof(userReceived) !== 'object' ){
			toastShort(userReceived);
			yield put(receiveUser());
		}else{
			yield put(receiveUser(userReceived));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveUser());
	}
}



export function* watchUser(){
	while (true) {
		const { path } = yield take(types.REQUEST_USER);
		yield fork(fetchUserSagas, path);
	}
}