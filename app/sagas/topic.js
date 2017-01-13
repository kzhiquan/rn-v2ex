import { put, take, call, fork } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { 
	receiveTopic, 
	endFavoriteTopic, 
	endThankTopic, 
	endReplyTopic,
	endThankReply,
	requestTopic,
} from '../actions/topic';

import { 
	fetchTopic, 
	favoriteTopic, 
	thankTopic, 
	replyTopic,
	thankReply,
} from '../utils/SiteUtil'



function* fetchTopicSagas(wrapList, path, page){
	try{

		const result = yield call(fetchTopic, wrapList, path, page); 
		//console.log('topicReceived:', topicReceived);

		/*if( typeof(topicReceived) !== 'object' ){
			toastShort(topicReceived);
			yield put(receiveTopic());
		}else{
			yield put(receiveTopic(topicReceived));
		}*/
		yield put(receiveTopic(result));

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveTopic(wrapList));
	}
}


export function* watchTopic(){
	while (true) {
		//const { isRefreshing, isLoading, isLoadingMore, topic, page } = yield take(types.REQUEST_TOPIC);
		//yield fork(fetchTopicSagas, isRefreshing, isLoading, isLoadingMore, topic, page);
		const { wrapList, path, page } = yield take([ types.REQUEST_TOPIC, 
										   		  	  types.REFRESH_TOPIC, 
										   		  	  types.LOAD_MORE_TOPIC]);
		//console.log('user', 'page');
		yield fork(fetchTopicSagas, wrapList, path, page);
	}
}




function * favoriteTopicSagas(action){
	let topic = action.topic;
	try{
		const {newTopic, result} = yield call(favoriteTopic, topic);
		if(result){
			
			let msg = '取消收藏成功';
			if(newTopic.favorite_url.startsWith('/unfavorite')){
				msg = '收藏成功';
			}

			toastShort(msg);
		}else{

			let msg = '收藏失败';
			if(newTopic.favorite_url.startsWith('/unfavorite')){
				msg = '取消收藏失败';
			}
			toastShort(msg);
		}

		yield put(endFavoriteTopic(newTopic));

	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endFavoriteTopic(topic));
	}
}


export function* watchFavoriteTopic(){
	while (true) {
		//const { topic } = yield takeLatest(types.START_FAVORITE_TOPIC);
		//yield fork(favoriteTopicSagas, topic);
		yield *takeLatest(types.START_FAVORITE_TOPIC, favoriteTopicSagas);
	}
}


function* thankTopicSagas(action){
	let thankUrl = action.thankUrl
	try{

		const thankResult = yield call(thankTopic, thankUrl);
		if(thankResult){
			toastShort('感谢已发送!');
		}else{
			toastShort('感谢发送失败!');
		}

		yield put(endThankTopic(thankResult));

	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endThankTopic());
	}
}


export function* watchThankTopic(){
	while (true) {
		//const { thankUrl } = yield take(types.START_THANK_TOPIC);
		//yield fork(thankTopicSagas, thankUrl);
		yield* takeLatest(types.START_THANK_TOPIC, thankTopicSagas);
	}
}


function* replyTopicSagas(wrapList, content){
	let topic = wrapList.topic;
	try{
		const replyResult = yield call(replyTopic, topic, content);
		console.log('replyResult', replyResult);
		if(replyResult){
			toastShort('评论已发送!');
		}else{
			toastShort('评论发送失败!');
		}

		yield put(endReplyTopic(replyResult));
		yield put(requestTopic(wrapList, wrapList.topic.topic_url, 1));
		
	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endReplyTopic());
	}
}

export function* watchReplyTopic(){
	while (true){
		const { wrapList, content } = yield take(types.START_REPLY_TOPIC);
		yield fork(replyTopicSagas, wrapList, content);
	}
}


function* thankReplySagas(action){
	let reply = action.reply
	try{

		const thankResult = yield call(thankReply, reply);
		if(thankResult){
			toastShort('感谢已发送!');
			reply.thank_url = 'done';
		}else{
			toastShort('感谢发送失败!');
		}

		yield put(endThankReply(reply));

	}catch (error){
		console.log('error:', error);
		toastShort('网络发生错误, 请稍后重试');
		yield put(endThankReply(reply));
	}
}


export function* watchThankReply(){
	while (true) {
		//const { reply } = yield take(types.START_THANK_REPLY);
		//yield fork(thankReplySagas, reply);
		yield* takeLatest(types.START_THANK_REPLY, thankReplySagas)
	}
}



