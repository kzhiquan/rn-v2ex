import { put, take, call, fork, } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga';

import { toastShort } from '../utils/ToastUtil';
import * as types from '../constants/ActionTypes';

import {
 receiveSearch,
 endNodeSearch, 
} from '../actions/search';

import { 
	fetchBingSearch,
	fetchAllNode, 
} from '../utils/SiteUtil';


function* searchSaga(action){
	try{
		const { searchText, nextPageUrl } = action;
		const searchReceived = yield call(fetchBingSearch, searchText, nextPageUrl); 
		console.log('searchReceived:', searchReceived);

		if( typeof(searchReceived) !== 'object' ){
			toastShort(searchReceived);
			yield put(receiveSearch());
		}else{
			yield put(receiveSearch(searchReceived));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveSearch());
	}
}



export function* watchSearch(){
	while (true) {
		//const { searchText, nextPageUrl } = yield take([types.START_SEARCH, types.REFRESH_SEARCH, types.SEARCH_NEXT_PAGE]);
		//yield fork(searchSaga, searchText, nextPageUrl);
		yield* takeLatest([types.START_SEARCH, types.REFRESH_SEARCH, types.SEARCH_NEXT_PAGE], searchSaga);
	}
}



function* nodeSearchSaga(action){
	try{
		const { searchText, nodeList } = action;
		let searchReceived;
		if(nodeList.length > 0){
			searchReceived = nodeList;
		}else{
			searchReceived = yield call(fetchAllNode); 
		}
		
		console.log('searchReceived:', searchReceived);

		if( !Array.isArray(searchReceived) ){
			toastShort(searchReceived);
			yield put(endNodeSearch(searchText));
		}else{
			yield put(endNodeSearch(searchText, searchReceived));
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(endNodeSearch(searchText));
	}
}



export function* watchNodeSearch(){
	while (true) {
		yield* takeLatest(types.START_NODE_SEARCH, nodeSearchSaga);
	}
}