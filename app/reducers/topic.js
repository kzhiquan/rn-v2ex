import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

//const replyCountPerPage = 100;

const initialState = {
	isRefreshing : false,
	isLoading : false,
	isLoadingMore : false,
	wrapList : {
		list : [],
		topic : null,
	},

	isTopicMoreWorking: false,
	isReplyMoreWorking: false,
}

//console.log('REHYDRATE:', REHYDRATE);
export default function topic(state = initialState, action){
	switch(action.type){
		case types.REQUEST_TOPIC:
			return Object.assign({}, state, { 
				isLoading : true,
			} );

		case types.REFRESH_TOPIC:
			return Object.assign({}, state, { 
				isRefreshing : true,
			} );

		case types.LOAD_MORE_TOPIC:
			return Object.assign({}, state, { 
				isLoadingMore : true,
			} );

		case types.RECEIVE_TOPIC:
			return Object.assign({}, state, { 
				isRefreshing : false,
				isLoading : false,
				isLoadingMore : false,
				wrapList : action.wrapList,
			} );
			


		case types.START_FAVORITE_TOPIC:
			return Object.assign({}, state, {
				isLoading:true,
			})
		case types.END_FAVORITE_TOPIC:
			return Object.assign({}, state, {
				isLoading : false,
				wrapList : uupdateTopicFavorite(state, action),
			})


		case types.START_THANK_TOPIC:
			return Object.assign({}, state, {
				isLoading:true,
			})
		case types.END_THANK_TOPIC:
			return Object.assign({}, state, {
				isLoading:false,
				wrapList : updateTopicThank(state, action),
			})


		case types.START_REPLY_TOPIC:
			return Object.assign({}, state, {
				isLoading:true,
			})
		case types.END_REPLY_TOPIC:
			return Object.assign({}, state, {
				isLoading:false,
			})


		case types.START_THANK_REPLY:
			return Object.assign({}, state, {
				isLoading: true,
			})
		case types.END_THANK_REPLY:
			return Object.assign({}, state, {
				isLoading: false,
				wrapList : updateReplyThank(state, action),
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


function updateTopicThank(state, action){
	//console.log('action', action, state)
	if(action.result){
		state.wrapList.topic.thank_url = 'done';
	}
	//console.log('action', action, state)
	return state.wrapList;
}

function uupdateTopicFavorite(state, action){
	state.wrapList.topic = action.topic;
	return state.wrapList;
}

function updateTopicReply(state, action){
	if(action.result){
		state.wrapList.topic.reply_count = (parseInt(state.wrapList.topic.reply_count) + 1).toString();
	}
	return state.wrapList;
}

function updateReplyThank(state, action){

	let foundIndex = state.wrapList.list.findIndex( (reply, index, arr) => {
		return reply.floor_number == action.reply.floor_number;
	});

	state.wrapList.list[foundIndex] = action.reply;

	return state.wrapList;
}



