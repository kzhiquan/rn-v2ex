import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { receiveNodeList } from '../actions/nodeList';
import { fetchCategoryNode, fetchAllNode, fetchNode } from '../utils/SiteUtil'



function* fetchNodeListSagas(){
	try{
		const {categoryNodeList, allNode} = yield call(fetchNode);
		//console.log('categoryNodeList', categoryNodeList, 'allNode', allNode);
		if( typeof(categoryNodeList) == 'object' && Array.isArray(allNode) ){
			yield put(receiveNodeList(categoryNodeList, allNode));
		}else{
			toastShort('请求节点错误！');
			yield put(receiveNodeList());
		}

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(receiveNodeList());
	}
}



export function* watchNodeList(){
	while (true) {
		yield take(types.REQUEST_NODE_LIST);
		yield fork(fetchNodeListSagas);
	}
}