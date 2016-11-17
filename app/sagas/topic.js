import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveTopic } from '../actions/topic';
import { fetchTopic } from '../utils/SiteUtil'



function* fetchTopicSagas(isRefreshing, isLoading, isLoadingMore, topic, page){
	try{

		const topicReceived = yield call(fetchTopic, topic, page); 
		//console.log('topicReceived:', topicReceived);

		if( typeof(topicReceived) !== 'object' ){
			yield toastShort(topicReceived);
		}else{
			yield put(receiveTopic(topicReceived));
		}



	} catch ( error ){
		console.log('error:', error);
		yield toastShort('网络发生错误，请重试');
	}
}



export function* watchTopic(){
	while (true) {
		const { isRefreshing, isLoading, isLoadingMore, topic, page } = yield take(types.REQUEST_TOPIC);
		yield fork(fetchTopicSagas, isRefreshing, isLoading, isLoadingMore, topic, page);
	}
}