import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveTopic, endFavoriteTopic, endThankTopic, endReplyTopic } from '../actions/topic';
import { fetchTopic, favoriteTopic, thankTopic, replyTopic} from '../utils/SiteUtil'



function* fetchTopicSagas(isRefreshing, isLoading, isLoadingMore, topic, page){
	try{

		const topicReceived = yield call(fetchTopic, topic, page); 
		//console.log('topicReceived:', topicReceived);

		if( typeof(topicReceived) !== 'object' ){
			toastShort(topicReceived);
			yield put(receiveTopic());
		}else{
			yield put(receiveTopic(topicReceived));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveTopic());
	}
}


export function* watchTopic(){
	while (true) {
		const { isRefreshing, isLoading, isLoadingMore, topic, page } = yield take(types.REQUEST_TOPIC);
		yield fork(fetchTopicSagas, isRefreshing, isLoading, isLoadingMore, topic, page);
	}
}




function * favoriteTopicSagas(favoriteUrl){
	try{

		const favoriteResult = yield call(favoriteTopic, favoriteUrl);
		if(favoriteResult){
			toastShort('收藏成功!');
		}else{
			toastShort('收藏失败!');
		}

		yield put(endFavoriteTopic());

	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endFavoriteTopic());
	}
}


export function* watchFavoriteTopic(){
	while (true) {
		const { favoriteUrl } = yield take(types.START_FAVORITE_TOPIC);
		yield fork(favoriteTopicSagas, favoriteUrl);
	}
}


function* thankTopicSagas(thankUrl){
	try{

		const thankResult = yield call(thankTopic, thankUrl);
		if(thankResult){
			toastShort('感谢已发送!');
		}else{
			toastShort('感谢发送失败!');
		}

		yield put(endThankTopic());

	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endThankTopic());
	}
}


export function* watchThankTopic(){
	while (true) {
		const { thankUrl } = yield take(types.START_THANK_TOPIC);
		yield fork(thankTopicSagas, thankUrl);
	}
}


function* replyTopicSagas(topicUrl, once, content){
	try{
		const replyResult = yield call(replyTopic, topicUrl, once, content);
		console.log('replyResult', replyResult);
		if(replyResult){
			toastShort('评论已发送!');
		}else{
			toastShort('评论发送失败!');
		}

		yield put(endReplyTopic());
		
	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endReplyTopic());
	}
}

export function* watchReplyTopic(){
	while (true){
		const { topicUrl, once, content } = yield take(types.START_REPLY_TOPIC);
		yield fork(replyTopicSagas, topicUrl, once, content);
	}
}



