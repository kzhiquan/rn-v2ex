import { put, take, call, fork } from 'redux-saga/effects'

import { toastShort } from '../utils/ToastUtil';
import * as types from '../constants/ActionTypes';
import { receiveSearch } from '../actions/search';
import { fetchSearch } from '../utils/SiteUtil';


function* searchSaga(searchText){
	try{
		
		const searchReceived = yield call(fetchSearch, searchText); 
		//console.log('searchReceived:', searchReceived);

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
		const { searchText, searchNextPage } = yield take([types.START_SEARCH, types.REFRESH_SEARCH, types.SEARCH_NEXT_PAGE]);
		yield fork(searchSaga, searchText, searchNextPage);
	}
}