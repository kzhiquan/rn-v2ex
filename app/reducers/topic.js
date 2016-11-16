import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'


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
				topic : state.isLoadingMore ? loadMore(state, action) : combine(state, action),
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


function combine(state, action) {
	state.topic = action.topic;
	return state.topic;
}

function loadMore(state, action) {
	action.topic.replyList = state.topic.replyList.concat(action.topic.replyList);
  	return action.topic;
}


