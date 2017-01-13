import { put, take, call, fork } from 'redux-saga/effects';


import * as types from '../constants/ActionTypes';
import { toastShort } from '../utils/ToastUtil';

import { 
	receiveRecentTopic, 
} from '../actions/recent';

import { 
	fetchTopicListExt,
} from '../utils/SiteUtil'


function* fetchRecentTopicSagas(wrapList, path, page){
	try{

		//console.log('list', list, path, page);
		const result = yield call(fetchTopicListExt, wrapList, path, page); 

		//console.log('result', result);

		yield put(receiveRecentTopic(result));

	} catch ( error ){

		yield put(receiveRecentTopic(wrapList));

		toastShort('网络发生错误，请重试');
	}
}

export function* watchRecentTopic(){
	while (true) {
		const { wrapList, path, page } = yield take([ types.REQUEST_RECENT_TOPIC, 
										   		  types.REFRESH_RECENT_TOPIC, 
										   		  types.REQUEST_MORE_RECENT_TOPIC]);
		//console.log('user', 'page');
		yield fork(fetchRecentTopicSagas, wrapList, path, page);
	}
}