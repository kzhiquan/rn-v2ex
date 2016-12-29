import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';

import { 
	receiveMyTopic, 
	receiveMyReply, 
	userLogin, 
	receiveMyNode,
	receiveMyFavoriteTopic,
	receiveMyNotification,
	receiveMyFocusPerson,
	endDeleteMyNotification,
	endUserLogout,
	endChangeUser,
	endAddAccount,
} from '../actions/auth';

import {
	
	receiveCategoryNodeList,

} from '../actions/nodeList';
//import { changeUserEnd } from '../actions/account'

import { 
	fetchMyTopic, 
	fetchMyReply, 
	login, 
	fetchMyNode,
	fetchMyFavoriteTopic,
	fetchMyNotification,
	deleteNotification,
	logout,
} from '../utils/SiteUtil'


function* requestLogoutSagas(user){
	try{
		const result = yield call(logout, user.logout_url); 
		if(result){
			toastShort('注销成功');
		}else{
			toastShort('注销失败');
		}
		
		yield put(endUserLogout(result));

	} catch ( error ){
		console.log('error', error);
		toastShort('网络发生错误，请重试');
		
		yield put(endUserLogout(false));
	}
}

export function* watchLogout(){
	while (true) {
		const { user } = yield take(types.USER_LOGOUT);
		yield fork(requestLogoutSagas, user);
	}
}



function* fetchMyTopicSagas(myTopicUrl, page){
	try{

		const result = yield call(fetchMyTopic, myTopicUrl,page); 

		//console.log('result', result);

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
		const result = yield call(login, newUser.name, newUser.password);
		if(!result){
			toastShort('切换失败，请检查用户名／密码！');
		}else{
			toastShort('切换成功！');
			//yield put(userLogin(user));
		}

		const { user, categoryNodeList } = result;

		yield put(endChangeUser(user));

	} catch (error){
		console.log('error', error);
		toastShort('网络发生错误，请重试');
		yield put(endChangeUser());
	}

}

export function * wathChangeUser(){
	while (true){
		const { user } = yield take(types.CHANGE_USER);
		console.log('user', user);
		yield fork(changeUserSagas, user);
	}
}





function* checkUser(name, password){
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
			//console.log('user', user, categoryNodeList);
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




function* fetchMyNodeSagas(myReplyUrl, page){
	try{

		const result = yield call(fetchMyNode); 

		console.log('result', result);

		yield put(receiveMyNode(result));

	} catch ( error ){
		console.log('error', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveMyNode());
	}
}

export function* watchAuthNode(){
	while (true) {
		yield take(types.REQUEST_MY_NODE);
		yield fork(fetchMyNodeSagas);
	}
}


function* fetchMyFavoriteTopicSagas(path, page){
	try{

		const result = yield call(fetchMyFavoriteTopic, path, page); 

		console.log('result', result);

		yield put(receiveMyFavoriteTopic(result.topicList, result.totalCount));

	} catch ( error ){
		toastShort('网络发生错误,请重试');
		console.log('error', error);
		yield put(receiveMyFavoriteTopic());
	}
}

export function* watchAuthFavoriteTopic(){
	while (true) {
		const { path, page } = yield take([ types.REQUEST_MY_FAVORITE_TOPIC, 
									 		types.REFRESH_MY_FAVORITE_TOPIC, 
									 		types.REQUEST_MORE_MY_FAVORITE_TOPIC]);

		yield fork(fetchMyFavoriteTopicSagas, path, page);
	}
}


function* fetchMyFocusPersonSagas(path, page){
	try{

		const result = yield call(fetchMyFavoriteTopic, path, page); 

		//console.log('result', result);

		yield put(receiveMyFocusPerson(result.topicList, result.totalCount));

	} catch ( error ){
		toastShort('网络发生错误,请重试');
		console.log('error', error);
		yield put(receiveMyFocusPerson());
	}
}

export function* watchAuthFocusPerson(){
	while (true) {
		const { path, page } = yield take([ types.REQUEST_MY_FOCUS_PERSON, 
									 		types.REFRESH_MY_FOCUS_PERSON, 
									 		types.REQUEST_MORE_MY_FOCUS_PERSON]);

		yield fork(fetchMyFocusPersonSagas, path, page);
	}
}


function* fetchMyNotificationSagas(page){
	try{

		const result = yield call(fetchMyNotification, page); 

		console.log('result', result);

		yield put(receiveMyNotification(result.notificationList, result.totalCount));

	} catch ( error ){
		toastShort('网络发生错误,请重试');
		console.log('error', error);
		yield put(receiveMyNotification());
	}
}

export function* watchAuthNotification(){
	while (true) {
		const { page } = yield take([ types.REQUEST_MY_NOTIFICATION, 
									 		types.REFRESH_MY_NOTIFICATION, 
									 		types.REQUEST_MORE_MY_NOTIFICATION]);

		yield fork(fetchMyNotificationSagas, page);
	}
}


function* fetchDeleteNotificationSagas(notification){
	try{

		const result = yield call(deleteNotification, notification.delete_url); 
		if(result){
			toastShort('删除成功');
			yield put(endDeleteMyNotification(notification));
		}else{
			toastShort('删除失败');
			yield put(endDeleteMyNotification());
		}

		console.log('result', result);

	} catch ( error ){
		toastShort('网络发生错误,请重试');
		console.log('error', error);
		yield put(endDeleteMyNotification());
	}
}

export function* watchDeleteNotification(){
	while (true) {
		const { notification } = yield take(types.DELETE_MY_NOTIFICATION);

		yield fork(fetchDeleteNotificationSagas, notification);
	}
}



