import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveTopicList } from '../actions/topicList';
import { fetchTopicList } from '../utils/SiteUtil'



function* fetchTopicListSagas(isRefreshing, isLoading, isLoadingMore, path, page){
	try{

		const topicList = yield call(fetchTopicList, path, page); 
		if(!Array.isArray(topicList) ){
			yield toastShort(topicList);
		}else{
			yield put(receiveTopicList(topicList, path));
		}

	} catch ( error ){
		console.log('error:', error);
		yield toastShort('网络发生错误，请重试');
	}
}



export function* watchTopicList(){
	while (true) {
		const { isRefreshing, isLoading, isLoadingMore, path, page } = yield take(types.REQUEST_TOPIC_LIST);
		yield fork(fetchTopicListSagas, isRefreshing, isLoading, isLoadingMore, path, page);
	}
}