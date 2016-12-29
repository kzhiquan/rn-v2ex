import * as types from '../constants/ActionTypes';



export function requestNodeList(){
	return {
		type : types.REQUEST_NODE_LIST,
	};
}


export function receiveNodeList(categoryNodeList, allNode){
	return {
		type : types.RECEIVE_NODE_LIST,
		categoryNodeList : categoryNodeList,
		allNode : allNode,
	}
}


export function receiveCategoryNodeList(categoryNodeList){
	return {
		type : types.RECEIVE_CATEGORY_NODE_LIST,
		categoryNodeList : categoryNodeList,
	}
}

export function requestNodePage(path){
	return {
		type : types.REQUEST_NODE_PAGE,
		path,
	}
}

export function endRequestNodePage(){
	return {
		type : types.END_REQUEST_NODE_PAGE,
	}
}