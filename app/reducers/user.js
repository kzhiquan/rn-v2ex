import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

const initialState = {

	isLoading : false,
	user : null,

	topicListExt:{
		isLoading : false,
		isRefreshing : false,
		isLoadingMore : false,
		list : [],
	},

	replyListExt:{
		isLoading : false,
		isRefreshing : false,
		isLoadingMore : false,
		list : [],
	},
}

export default function user(state = initialState, action){
	switch(action.type){
		case types.REQUEST_USER:
			return Object.assign({}, state, {
				isLoading : true,
			} );

		case types.RECEIVE_USER:
			return Object.assign({}, state, { 
				isLoading : false,
				user : action.user,
				topicListExt : Object.assign({}, state.topicListExt, {
					list : receiveUserAvatarToTopicList(state, action),
				}),
				replyListExt : Object.assign({}, state.topicListExt, {
					list : receiveUserAvatarAndNameToReplyList(state, action),
				}),
			} );

		case types.CLEAN_USER:
			return Object.assign({}, initialState);

		case types.REQUEST_USER_TOPIC_LIST:
			return Object.assign({}, state, {
				topicListExt : Object.assign({}, state.topicListExt, {
					isLoading:true,
				})
			})

		case types.REFHRES_USER_TOPIC_LIST:
			return Object.assign({}, state, {
				topicListExt : Object.assign({}, state.topicListExt, {
					isRefreshing:true,
				})
			})

		case types.LOAD_MORE_USER_TOPIC_LIST:
			return Object.assign({}, state, {
				topicListExt : Object.assign({}, state.topicListExt, {
					isLoadingMore:true,
				})
			})

		case types.RECEIVE_USER_TOPIC_LIST:
			return Object.assign({}, state, {
				topicListExt : Object.assign({}, state.topicListExt, {
					isLoading : false,
					isRefreshing : false,
					isLoadingMore : false,
					list : receiveTopicListAvatarToList(state, action),
				})
			})

		case types.REQUEST_USER_REPLY_LIST:
			return Object.assign({}, state, {
				replyListExt : Object.assign({}, state.replyListExt, {
					isLoading:true,
				})
			})

		case types.REFHRES_USER_REPLY_LIST:
			return Object.assign({}, state, {
				replyListExt : Object.assign({}, state.replyListExt, {
					isRefreshing:true,
				})
			})

		case types.LOAD_MORE_USER_REPLY_LIST:
			return Object.assign({}, state, {
				replyListExt : Object.assign({}, state.replyListExt, {
					isLoadingMore:true,
				})
			})

		case types.RECEIVE_USER_REPLY_LIST:
			return Object.assign({}, state, {
				replyListExt : Object.assign({}, state.replyListExt, {
					isLoading : false,
					isRefreshing : false,
					isLoadingMore : false,
					list : receiveReplyListAvatarAndNameToList(state, action),
				})
			})

		case types.REQUEST_FOCUS_USER:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.END_REQUEST_FOCUS_USER:
			return Object.assign({}, state, {
				isLoading : false,
			});

		case types.REQUEST_BLOCK_USER:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.END_REQUEST_BLOCK_USER:
			return Object.assign({}, state, {
				isLoading : false,
			})

		case REHYDRATE:
			return Object.assign({}, initialState);

		default:
			return state;
	}
}


function receiveTopicListAvatarToList(state, action){

	if(!state.user) return action.list;

	return  action.list.map( (topic, index, arr) => {
				topic.member_avatar = state.user.member_avatar;
				return topic;
			});

}

function receiveUserAvatarToTopicList(state, action){
	return state.topicListExt.list.map( (topic, index, arr)=> {
				topic.member_avatar = action.user.member_avatar;
				return topic;
		   });
}


function receiveReplyListAvatarAndNameToList(state, action){

	if(!state.user) return action.list;

	return  action.list.map( (reply, index, arr) => {
				reply.member_avatar = state.user.member_avatar;
				reply.member_name = state.user.member_name;
				return reply;
			});

}

function receiveUserAvatarAndNameToReplyList(state, action){
	return state.replyListExt.list.map( (reply, index, arr)=> {
				reply.member_avatar = action.user.member_avatar;
				reply.member_name = action.user.member_name;
				return reply;
		   });
}

