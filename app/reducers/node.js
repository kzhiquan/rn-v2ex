
import * as types from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'


const initialState = {
	
	isLoading : false,
	isRefreshing : false,
	isLoadingMore : false,

	categoryNodeList : null,
	allNode: null,
	currentNode : null,
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
			return Object.assign({}, state, {
				isLoading : false,
				isRefreshing : false,
				isLoadingMore : false,
				currentNode : action.currentNode,
			});

		case types.REFRESH_NODE_PAGE:
			return Object.assign({}, state, {
				isRefreshing : true,
			});
			
		case types.REQUEST_MORE_NODE_PAGE:
			return Object.assign({}, state, {
				isLoadingMore : true,
			})

		case REHYDRATE:
			return Object.assign({}, state, action.payload.nodeList, {
				//categoryNodeList:null,
			});

		default:
			return state;
	}
}



