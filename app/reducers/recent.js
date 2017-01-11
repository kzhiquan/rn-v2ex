import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'


const initialState = {
	isLoading : false,
	isRefreshing : false,
	isLoadingMore : false,
	list : [],
}


export default function recent(state = initialState, action){
	//console.log('state', state);
	switch(action.type){

		case types.REQUEST_RECENT_TOPIC:
			return Object.assign({}, state, { 
				isLoading : true,
			} );

		case types.REFRESH_RECENT_TOPIC:
			return Object.assign({}, state, { 
				isRefreshing : true,
			} );

		case types.REQUEST_MORE_RECENT_TOPIC:
			return Object.assign({}, state, { 
				isLoadingMore : true,
			} );

		case types.RECEIVE_RECENT_TOPIC:
			return Object.assign({}, state, { 
				isRefreshing : false,
				isLoading : false,
				isLoadingMore : false,
				list : action.list,
			} );

		case REHYDRATE:
			return Object.assign({}, state, {
				isLoading:false,
				isRefreshing:false,
				isLoadingMore:false,
			});

		default:
			return state;
	}
}