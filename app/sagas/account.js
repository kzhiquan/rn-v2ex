import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { accountAdd, accountDelete, userReceive } from '../actions/account';
import { login } from '../utils/SiteUtil'



export function* checkUser(name, password){
	try{
		//console.log('isRefreshing', isRefreshing, 'isLoading', isLoading, 'path:', path);

		const user = yield call(login, name, password);

		//console.log('user', user);

		yield put(userReceive(user));

	} catch ( error ){
		console.error('error:', error);
		yield toastShort('网络发生错误，请重试');
	}
}



export function* watchAccount(){
	while (true) {
		const { name, password } = yield take(types.ACCOUNT_ADD);
		yield fork(checkUser, name, password);
	}
}