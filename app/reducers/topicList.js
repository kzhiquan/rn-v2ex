import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'


const initialState = {
	isRefreshing : false,
	isLoading : false,
	isLoadingMore : false,
	topicList : {}
}

//console.log('REHYDRATE:', REHYDRATE);

export default function topicList(state = initialState, action){
	switch(action.type){
		case types.REQUEST_TOPIC_LIST:
			return Object.assign({}, state, { 
				isRefreshing : action.isRefreshing,
				isLoading : action.isLoading,
				isLoadingMore : action.isLoadingMore
			} );

		case types.RECEIVE_TOPIC_LIST:
			return Object.assign({}, state, { 
				isRefreshing : false,
				isLoading : false,
				isLoadingMore : false,
				topicList : state.isLoadingMore ? loadMore(state, action) : combine(state, action),
			} );

		case REHYDRATE:
			return Object.assign({}, state, {
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



