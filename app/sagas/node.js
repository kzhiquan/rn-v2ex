import { put, take, call, fork } from 'redux-saga/effects'
import { toastShort } from '../utils/ToastUtil';

import * as types from '../constants/ActionTypes';
import { 
	receiveNodeList,
	endRequestNodePage, 
	endRequestFavoriteNode,
} from '../actions/node';

import { 
	fetchCategoryNode, 
	fetchAllNode, 
	fetchNode,
	fetchNodePage,
	requestFavoriteNode, 
} from '../utils/SiteUtil'



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





function* fetchNodePageSagas(currentNode, page){
	try{
		console.log('currentNode', currentNode, page);
		let result= yield call(fetchNodePage, currentNode, page);
		//console.log('result', result);

		yield put(endRequestNodePage(result));

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(endRequestNodePage(currentNode));
	}
}


export function* watchNodePage(){
	while (true) {
		const { currentNode, page } = yield take([types.REQUEST_NODE_PAGE, types.REFRESH_NODE_PAGE, types.REQUEST_MORE_NODE_PAGE]);
		yield fork(fetchNodePageSagas, currentNode, page);
	}
}



function* requestFavoriteNodeSagas(node){
	try{
		const result = yield call(requestFavoriteNode, node); 
		if(result){
			if(node.favorite_url.indexOf('unfavorite') > 0){
				toastShort('取消收藏成功');
				node.favorite_url = node.favorite_url.replace('unfavorite', 'favorite')
			}else{
				toastShort('收藏成功');
				node.favorite_url = node.favorite_url.replace('favorite', 'unfavorite');
			}
		}else{
			toastShort("操作失败");
		}

		yield put(endRequestFavoriteNode());

	} catch ( error ){
		console.log('error:', error);
		toastShort('网络发生错误，请重试');
		yield put(endRequestFavoriteNode());
	}
}



export function* watchFavoriteNode(){
	while (true) {
		const { node } = yield take(types.REQUEST_FAVORITE_NODE);
		yield fork(requestFavoriteNodeSagas, node);
	}
}