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
	receiveCategoryNodeList, 
} from '../actions/nodeList';


import { 
	userLogin,
	endAddAccount,
 } from '../actions/auth'

import { login } from '../utils/SiteUtil'



export function* checkUser(name, password){
	try{

		//yield put(userCheckStart());
		const result = yield call(login, name, password);
		if(!result){
			toastShort('添加失败，检查用户名密码！');
			yield put(endAddAccount());
		}else{
			toastShort('添加成功！');
			//yield put(userLogin(user));
			let { user, categoryNodeList } = result;
			console.log('user', user, categoryNodeList);
			user.name = name;
			user.password = password;
			yield put(endAddAccount(user));
			yield put(receiveCategoryNodeList(categoryNodeList));
		}
		
		//yield put(userReceive(user));
		//yield put(userCheckEnd());
		//yield put(endAddAccount(true));

	} catch ( error ){
		console.log('error:', error);
		//yield put(userCheckEnd());
		yield put(endAddAccount());
		toastShort('网络发生错误,请重试');
	}
}



export function* watchAddAccount(){
	while (true) {
		const { name, password } = yield take(types.ADD_ACCOUNT);
		yield fork(checkUser, name, password);
	}
}