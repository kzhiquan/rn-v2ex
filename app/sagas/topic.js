import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { requestTopic, receiveTopic } from '../actions/topic';
import { fetchTopicList } from '../utils/SiteUtil'



export function* fetchTopicSagas(isRefreshing, isLoading, isLoadingMore, path, page){
	try{
		//console.log('isRefreshing', isRefreshing, 'isLoading', isLoading, 'path:', path);

		const topicList = yield call(fetchTopicList, path, page); 
		if(!Array.isArray(topicList) ){
			yield toastShort(topicList);
		}else{
			yield put(receiveTopic(topicList, path));
		}

	} catch ( error ){
		console.log('error:', error);
		yield toastShort('网络发生错误，请重试');
	}
}



export function* watchTopic(){
	while (true) {
		const { isRefreshing, isLoading, isLoadingMore, path, page } = yield take(types.REQUEST_TOPIC);
		yield fork(fetchTopicSagas, isRefreshing, isLoading, isLoadingMore, path, page);
	}
}