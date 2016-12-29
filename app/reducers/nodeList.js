
import * as types from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'


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

		case types.RECEIVE_CATEGORY_NODE_LIST:
			return Object.assign({}, state, {
				categoryNodeList : action.categoryNodeList,
			});

		case REHYDRATE:
			return Object.assign({}, state, action.payload.nodeList, {
				//categoryNodeList:null,
			});

		default:
			return state;
	}
}



