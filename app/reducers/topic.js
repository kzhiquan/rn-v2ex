import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'


const initialState = {
	isInitialized: false,
	isRefreshing : false,
	isLoading : false,
	isLoadingMore : false,
	topicList : {}
}

console.log('REHYDRATE:', REHYDRATE);

export default function topic(state = initialState, action){
	switch(action.type){
		case types.NODE_TOPIC_PAGE_INIT:
			return Object.assign({}, state, {
				isInitialized:true,
				isRefreshing:false,
				isLoading:false,
				isLoadingMore:false,
				topicList:{},
			});

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
				topicList : state.isLoadingMore ? loadMore(state, action) : combine(state, action),
			} );

		case REHYDRATE:
			return Object.assign({}, state, {
				isInitialized:false,
				isRefreshing:false,
				isLoading:false,
				isLoadingMore:false,
				topicList:{},
			});

		default:
			return state;
	}
}


function combine(state, action) {
  state.topicList[action.path] = action.topicList;
  return state.topicList;
}

function loadMore(state, action) {
  state.topicList[action.path] = state.topicList[action.path].concat(action.topicList);
  return state.topicList;
}



