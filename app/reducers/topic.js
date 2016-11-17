import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

//const replyCountPerPage = 100;

const initialState = {
	isRefreshing : false,
	isLoading : false,
	isLoadingMore : false,
	topic : null,
}

//console.log('REHYDRATE:', REHYDRATE);
export default function topic(state = initialState, action){
	switch(action.type){
		case types.REQUEST_TOPIC:
			return Object.assign({}, state, { 
				isRefreshing : action.isRefreshing,
				isLoading : action.isLoading,
				isLoadingMore : action.isLoadingMore
			} );

		case types.RECEIVE_TOPIC:
			return Object.assign({}, state, { 
				isRefreshing : false,
				isLoading : false,
				isLoadingMore : false,
				topic : action.topic,
			} );

		case REHYDRATE:
			return Object.assign({}, state, {
				isRefreshing:false,
				isLoading:false,
				isLoadingMore:false,
				replyList:[],
			});

		default:
			return state;
	}
}


