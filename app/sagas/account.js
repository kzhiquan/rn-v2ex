import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { 
	accountAdd, 
	accountDelete, 
	userReceive,
	userCheckStart,
	userCheckEnd, 
} from '../actions/account';

import { 
	userLogin,
	endAddAccount,
 } from '../actions/auth'

import { login } from '../utils/SiteUtil'



export function* checkUser(name, password){
	try{

		//yield put(userCheckStart());
		const user = yield call(login, name, password);
		if(!user){
			toastShort('添加失败，检查用户名密码！');
			yield put(endAddAccount(false));
		}else{
			toastShort('添加成功！');
			yield put(userLogin(user));
			yield put(endAddAccount(true));
		}
		
		//yield put(userReceive(user));
		//yield put(userCheckEnd());
		//yield put(endAddAccount(true));

	} catch ( error ){
		console.log('error:', error);
		//yield put(userCheckEnd());
		yield put(endAddAccount(false));
		toastShort('网络发生错误,请重试');
	}
}



export function* watchAddAccount(){
	while (true) {
		const { name, password } = yield take(types.ADD_ACCOUNT);
		yield fork(checkUser, name, password);
	}
}