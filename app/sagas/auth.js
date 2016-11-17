import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';

import { receiveMyTopic, receiveMyReply, userLogin } from '../actions/auth'
import { changeUserEnd } from '../actions/account'
import { fetchMyTopic, fetchMyReply, login } from '../utils/SiteUtil'




function* fetchMyTopicSagas(myTopicUrl, page){
	try{

		const result = yield call(fetchMyTopic, myTopicUrl,page); 

		console.log('result', result);

		yield put(receiveMyTopic(result));
		//yield put(receiveMyTopic());

	} catch ( error ){

		yield put(receiveMyTopic({topics:[]}));

		toastShort('网络发生错误，请重试');

	}
}

export function* watchAuthTopic(){
	while (true) {
		const { user, page } = yield take([types.REQUEST_MY_TOPIC, types.REFRESH_MY_TOPIC, types.REQUEST_MORE_MY_TOPIC]);
		//console.log('user', 'page');
		yield fork(fetchMyTopicSagas, user.member_url, page);
	}
}


function* fetchMyReplySagas(myReplyUrl, page){
	try{

		const result = yield call(fetchMyReply, myReplyUrl, page); 

		console.log('result', result);

		yield put(receiveMyReply(result));

	} catch ( error ){

		yield put(receiveMyReply({replies:[]}));

		toastShort('网络发生错误，请重试');

	}
}

export function* watchAuthReply(){
	while (true) {
		const { user, page } = yield take([types.REQUEST_MY_REPLY, types.REFRESH_MY_REPLY, types.REQUEST_MORE_MY_REPLY]);
		yield fork(fetchMyReplySagas, user.member_url, page);
	}
}



function* changeUserSagas(newUser){

	try{
		const user = yield call(login, newUser.name, newUser.password);
		if(!user){
			toastShort('切换失败，请检查用户名／密码！');
		}else{
			toastShort('切换成功！');
			yield put(userLogin(user));
		}

		yield put(changeUserEnd());

	} catch (error){
		console.log('error', error);
		toastShort('网络发生错误，请重试');
		yield put(changeUserEnd());
	}

}

export function * wathChangeUser(){
	while (true){
		const { user } = yield take(types.CHANGE_USER_START);
		yield fork(changeUserSagas, user);
	}
}



