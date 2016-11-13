import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveMyTopic, receiveMyReply } from '../actions/auth'

import { fetchMyTopic, fetchMyReply } from '../utils/SiteUtil'




export function* fetchUserTopic(myTopicUrl){
	try{

		const result = yield call(fetchMyTopic, myTopicUrl); 

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
		const { user } = yield take([types.REQUEST_MY_TOPIC, types.REFRESH_MY_TOPIC]);
		yield fork(fetchUserTopic, user.member_url);
	}
}


export function* fetchUserReply(myReplyUrl){
	try{

		const result = yield call(fetchMyReply, myReplyUrl); 

		console.log('result', result);

		yield put(receiveMyReply(result));

	} catch ( error ){

		yield put(receiveMyReply({replies:[]}));

		toastShort('网络发生错误，请重试');

	}
}



export function* watchAuthReply(){
	while (true) {
		const { user } = yield take([types.REQUEST_MY_REPLY, types.REFRESH_MY_REPLY]);
		yield fork(fetchUserReply, user.member_url);
	}
}