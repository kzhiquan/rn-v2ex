import * as types from '../constants/ActionTypes'

const initialState = {
	isRefreshing : false,
	isLoading : false,
	topicList : []
}


export default function topic(state = initialState, action){
	switch(action.type){
		case types.TOPIC_REQUEST:
			return Object.assign({}, state, { 
				isRefreshing : action.isRefreshing,
				isLoading : action.isLoading
			} );
		case types.TOPIC_RECEIVE:
			return Object.assign({}, state, { 
				isRefreshing : false,
				isLoading : false,
				topicList : action.topicList
			} );
		default:
			return state;
	}
}