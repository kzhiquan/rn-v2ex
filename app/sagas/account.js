import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { 
	accountAdd, 
	accountDelete, 
	userReceive,
	userCheckStart,
	userCheckEnd 
} from '../actions/account';

import { userLogin } from '../actions/auth'

import { login, isLogin } from '../utils/SiteUtil'



export function* checkUser(name, password){
	try{

		yield put(userCheckStart());
		const user = yield call(login, name, password);
		if(!user){
			toastShort('验证失败，请检查邮箱／密码！');
		}else{
			toastShort('验证成功！');
			yield put(userLogin(user));
		}
		
		yield put(userReceive(user));
		yield put(userCheckEnd());

	} catch ( error ){
		console.log('error-:', error);
		yield put(userCheckEnd());
		toastShort('网络发生错误，请重试');

	}
}



export function* watchAccount(){
	while (true) {
		const { name, password } = yield take(types.ACCOUNT_ADD);
		yield fork(checkUser, name, password);
	}
}