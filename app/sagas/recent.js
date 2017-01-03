import { put, take, call, fork } from 'redux-saga/effects';


import * as types from '../constants/ActionTypes';
import { toastShort } from '../utils/ToastUtil';

import { 
	receiveRecentTopic, 
} from '../actions/recent';

import { 
	fetchTopicListExt,
} from '../utils/SiteUtil'


function* fetchRecentTopicSagas(wrapList, page){
	try{

		console.log('wrapList', wrapList, page);
		const result = yield call(fetchTopicListExt, wrapList, page); 

		console.log('result', result);

		yield put(receiveRecentTopic(wrapList));

	} catch ( error ){

		yield put(receiveRecentTopic(wrapList));

		toastShort('网络发生错误，请重试');
	}
}

export function* watchRecentTopic(){
	while (true) {
		const { wrapList, page } = yield take([ types.REQUEST_RECENT_TOPIC, 
										   		types.REFRESH_RECENT_TOPIC, 
										   		types.REQUEST_MORE_RECENT_TOPIC]);
		//console.log('user', 'page');
		yield fork(fetchRecentTopicSagas, wrapList, page);
	}
}