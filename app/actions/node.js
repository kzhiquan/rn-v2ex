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

export function requestNodePage(currentNode){
	return {
		type : types.REQUEST_NODE_PAGE,
		currentNode,
	}
}

export function refreshNodePage(currentNode){
	return {
		type : types.REFRESH_NODE_PAGE,
		currentNode,
	}
}

export function requestMoreNodePage(currentNode, page){
	return {
		type : types.REQUEST_MORE_NODE_PAGE,
		currentNode,
		page,
	}
}

export function endRequestNodePage(currentNode){
	return {
		type : types.END_REQUEST_NODE_PAGE,
		currentNode,
	}
}