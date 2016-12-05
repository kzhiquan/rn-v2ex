import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

//const replyCountPerPage = 100;

const initialState = {
	isRefreshing : false,
	isLoading : false,
	isLoadingMore : false,
	topic : null,

	isTopicMoreWorking: false,
	isReplyMoreWorking: false,
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
			

		case types.START_FAVORITE_TOPIC:
			return Object.assign({}, state, {
				isTopicMoreWorking:true,
			})
		case types.END_FAVORITE_TOPIC:
			return Object.assign({}, state, {
				isTopicMoreWorking:false
			})


		case types.START_THANK_TOPIC:
			return Object.assign({}, state, {
				isTopicMoreWorking:true,
			})
		case types.END_THANK_TOPIC:
			return Object.assign({}, state, {
				isTopicMoreWorking:false
			})


		case types.START_REPLY_TOPIC:
			return Object.assign({}, state, {
				isTopicMoreWorking:true,
			})
		case types.END_REPLY_TOPIC:
			return Object.assign({}, state, {
				isTopicMoreWorking:false
			})


		case types.START_THANK_REPLY:
			return Object.assign({}, state, {
				isReplyMoreWorking:true,
			})
		case types.END_THANK_REPLY:
			return Object.assign({}, state, {
				isReplyMoreWorking:false
			})


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


