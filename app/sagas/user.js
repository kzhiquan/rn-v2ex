import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';

import { 
	receiveUser, 
	receiveUserTopicList, 
	receiveUserReplyList,
	endRequestFocusUser, 
	endRequestBlockUser,
} from '../actions/user';

import { 
	fetchUser, 
	fetchUserTopicList, 
	fetchUserReplyList,
	requestFocusUser, 
	requestBlockUser,
} from '../utils/SiteUtil'



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



function* fetchUserTopicListSagas(list, path, page){
	try{

		console.log('list', list, path, page);
		const result = yield call(fetchUserTopicList, list, path, page); 

		console.log('result', result);

		yield put(receiveUserTopicList(result));


	} catch ( error ){
		console.log('error:', error);
		//toastShort('网络发生错误，请重试');
		//yield put(receiveUserTopicList());

		yield put(receiveUserTopicList(list));
		toastShort('网络发生错误，请重试');
	}
}



export function* watchUserTopicList(){
	while (true) {
		const { list, path, page } = yield take([ types.REQUEST_USER_TOPIC_LIST, 
								   				  types.REFRESH_USER_TOPIC_LIST, 
								   				  types.LOAD_MORE_USER_TOPIC_LIST]);
		yield fork(fetchUserTopicListSagas, list, path, page);
	}
}


function* fetchUserReplyListSagas(list, path, page){
	try{
		//console.log('path', path, 'page', page);
		/*const userReplyListReceived = yield call(fetchUserReplyList, path, page); 
		//console.log('userReplyListReceived', userReplyListReceived)
		if( typeof(userReplyListReceived) !== 'object' ){
			toastShort(userReplyListReceived);
			yield put(receiveUserReplyList());
		}else{
			yield put(receiveUserReplyList(userReplyListReceived));
		}*/
		console.log('list', list, path, page);
		const result = yield call(fetchUserReplyList, list, path, page); 

		console.log('result', result);

		yield put(receiveUserReplyList(result));

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveUserReplyList(list));
	}
}



export function* watchUserReplyList(){
	while (true) {
		const { list, path, page } = yield take([ types.REQUEST_USER_REPLY_LIST, 
								   				  types.REFRESH_USER_REPLY_LIST, 
								   				  types.LOAD_MORE_USER_REPLY_LIST]);
		yield fork(fetchUserReplyListSagas, list, path, page);
	}
}


function* requestFocusUserSagas(user){
	try{
		const result = yield call(requestFocusUser, user.focus_url); 
		if(result){
			if(user.focus_url.indexOf('unfollow') > 0){
				toastShort('取消关注成功');
				user.focus_url = user.focus_url.replace('unfollow', 'follow')
			}else{
				toastShort('关注成功');
				user.focus_url = user.focus_url.replace('follow', 'unfollow');
			}
		}else{
			toastShort("操作失败");
		}

		//console.log('user', user);

		yield put(endRequestFocusUser());

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(endRequestFocusUser());
	}
}



export function* watchFocusUser(){
	while (true) {
		const { user } = yield take(types.REQUEST_FOCUS_USER);
		yield fork(requestFocusUserSagas, user);
	}
}

function* requestBlockUserSagas(user){
	try{
		const result = yield call(requestBlockUser, user.block_url); 
		if(result){
			if(user.block_url.indexOf('unblock') > 0){
				toastShort('取消屏蔽成功');
				user.block_url = user.block_url.replace('unblock', 'block')
			}else{
				toastShort('屏蔽成功');
				user.block_url = user.block_url.replace('block', 'unblock');
			}
		}else{
			toastShort("操作失败");
		}

		//console.log('user', user);

		yield put(endRequestBlockUser());

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(endRequestBlockUser());
	}
}



export function* watchBlockUser(){
	while (true) {
		const { user } = yield take(types.REQUEST_BLOCK_USER);
		yield fork(requestBlockUserSagas, user);
	}
}

