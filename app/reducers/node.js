
import * as types from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'


const initialState = {
	
	isLoading : false,
	isRefreshing : false,
	isLoadingMore : false,

	categoryNodeList : null,
	allNode: null,
	nodePageStack : [],
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

		case types.RECEIVE_CATEGORY_NODE_LIST:
			return Object.assign({}, state, {
				categoryNodeList : action.categoryNodeList,
			});

		case types.REQUEST_NODE_PAGE:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.END_REQUEST_NODE_PAGE:
			state.nodePageStack.push(action.currentNode);
			return Object.assign({}, state, {
				isLoading : false,
				isRefreshing : false,
				isLoadingMore : false,
				nodePageStack : state.nodePageStack,
			});

		case types.POP_NODE_PAGE_STACK:
			state.nodePageStack.pop();
			return Object.assign({}, state, {
				nodePageStack : state.nodePageStack,
			});

		case types.REFRESH_NODE_PAGE:
			return Object.assign({}, state, {
				isRefreshing : true,
			});
			
		case types.REQUEST_MORE_NODE_PAGE:
			return Object.assign({}, state, {
				isLoadingMore : true,
			});

		case types.REQUEST_FAVORITE_NODE:
			return Object.assign({}, state, { 
				isLoading : true,
			} );

		case types.END_REQUEST_FAVORITE_NODE:
			return Object.assign({}, state, { 
				isLoading : false,
			});

		case REHYDRATE:
			return Object.assign({}, state, action.payload.node, {
				//categoryNodeList:null,
				nodePageStack : [],
			});

		default:
			return state;
	}
}



