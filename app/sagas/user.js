import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveUser, receiveUserTopicList, receiveUserReplyList } from '../actions/user';
import { fetchUser, fetchUserTopicList, fetchUserReplyList } from '../utils/SiteUtil'



function* fetchUserSagas(path){
	try{

		const userReceived = yield call(fetchUser, path); 
		//console.log('userReceived:', userReceived);

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



function* fetchUserTopicListSagas(path, page){
	try{
		//console.log('path', path, 'page', page);
		const userTopicListReceived = yield call(fetchUserTopicList, path, page); 
		//console.log('userTopicListReceived', userTopicListReceived)
		if( typeof(userTopicListReceived) !== 'object' ){
			toastShort(userTopicListReceived);
			yield put(receiveUserTopicList());
		}else{
			yield put(receiveUserTopicList(userTopicListReceived));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveUserTopicList());
	}
}



export function* watchUserTopicList(){
	while (true) {
		const { path, page } = yield take(types.REQUEST_USER_TOPIC_LIST);
		yield fork(fetchUserTopicListSagas, path, page);
	}
}


function* fetchUserReplyListSagas(path, page){
	try{
		//console.log('path', path, 'page', page);
		const userReplyListReceived = yield call(fetchUserReplyList, path, page); 
		//console.log('userReplyListReceived', userReplyListReceived)
		if( typeof(userReplyListReceived) !== 'object' ){
			toastShort(userReplyListReceived);
			yield put(receiveUserReplyList());
		}else{
			yield put(receiveUserReplyList(userReplyListReceived));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveUserReplyList());
	}
}



export function* watchUserReplyList(){
	while (true) {
		const { path, page } = yield take(types.REQUEST_USER_REPLY_LIST);
		yield fork(fetchUserReplyListSagas, path, page);
	}
}