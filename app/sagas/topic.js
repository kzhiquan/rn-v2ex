import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { topicRequest, topicReceive } from '../actions/topic';
import { fetchTopicList } from '../models/Topic'



export function* fetchTopic(isRefreshing, isLoading, isLoadingMore, path){
	try{
		//console.log('isRefreshing', isRefreshing, 'isLoading', isLoading, 'path:', path);

		const topicList = yield call(fetchTopicList, path); 
		if(!Array.isArray(topicList) ){
			yield toastShort(topicList);
		}else{
			yield put(topicReceive(topicList));
		}

	} catch ( error ){
		console.error('error:', error);
		yield toastShort('网络发生错误，请重试');
	}
}



export function* watchTopic(){
	while (true) {
		const { isRefreshing, isLoading, isLoadingMore, path } = yield take(types.TOPIC_REQUEST);
		yield fork(fetchTopic, isRefreshing, isLoading, isLoadingMore, path);
	}
}