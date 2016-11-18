
import * as types from '../constants/ActionTypes'


const initialState = {
	isLoading : false,
	categoryNodeList : null,
	allNode: null,
}

export default function nodeList(state = initialState, action){
	switch(action.type){
		case types.REQUEST_NODE_LIST:
			return Object.assign({}, state, { 
				isLoading : true,
			} );

		case types.RECEIVE_NODE_LIST:
			return Object.assign({}, state, { 
				isLoading : false,
				categoryNodeList : action.categoryNodeList,
				allNode : action.allNode,
			} );

		default:
			return state;
	}
}



