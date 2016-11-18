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