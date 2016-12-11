import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { 
	receiveNewTopic,
	endPostNewTopic, 
} from '../actions/newTopic';

import { 
	fetchNewTopic, 
	postNewTopic,
} from '../utils/SiteUtil'



function* fetchNewTopicSagas(){
	try{
		const result = yield call(fetchNewTopic); 

		if( typeof(result) !== 'object' ){
			toastShort(result);
			yield put(receiveNewTopic());
		}else{
			yield put(receiveNewTopic(result.nodes, result.once));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveNewTopic());
	}
}


export function* watchFetchNewTopic(){
	while (true) {
		yield take(types.REQUEST_NEW_TOPIC);
		yield fork(fetchNewTopicSagas);
	}
}



function* postNewTopicSagas(title, content, node, once){
	try{

		const result = yield call(postNewTopic, title, content, node, once); 
		console.log('result:', result);
		if( !result || result.indexOf('/new') >= 0 ){
			toastShort('发生错误,请稍后再试！');
			yield put(endPostNewTopic());
		}else{
			yield put(endPostNewTopic(result));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(endPostNewTopic());
	}
}


export function* watchPostNewTopic(){
	while (true) {
		const { title, content, node, once} = yield take(types.POST_NEW_TOPIC);
		yield fork(postNewTopicSagas, title, content, node, once);
	}
}


