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