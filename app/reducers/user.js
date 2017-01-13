import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

const initialState = {

	isLoading : false,
	user : null,

	topicListExt:{
		isLoading : false,
		isRefreshing : false,
		isLoadingMore : false,
		wrapList : {
			list: [],
		},
	},

	replyListExt:{
		isLoading : false,
		isRefreshing : false,
		isLoadingMore : false,
		wrapList : {
			list : [],
		},
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
					wrapList : receiveUserAvatarToTopicList(state, action),
				}),
				replyListExt : Object.assign({}, state.topicListExt, {
					wrapList : receiveUserAvatarAndNameToReplyList(state, action),
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
					wrapList : receiveTopicListAvatarToList(state, action),
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
					wrapList : receiveReplyListAvatarAndNameToList(state, action),
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

	if(!state.user) return action.wrapList;

	action.wrapList.list =  action.wrapList.list.map( (topic, index, arr) => {
								topic.member_avatar = state.user.member_avatar;
								return topic;
					   		});

	return action.wrapList;

}

function receiveUserAvatarToTopicList(state, action){
	state.topicListExt.wrapList.list = state.topicListExt.wrapList.list.map( (topic, index, arr)=> {
											topic.member_avatar = action.user.member_avatar;
											return topic;
									   });
	return state.topicListExt.wrapList;
}


function receiveReplyListAvatarAndNameToList(state, action){

	if(!state.user) return action.wrapList;

	action.wrapList.list =  action.wrapList.list.map( (reply, index, arr) => {
								reply.member_avatar = state.user.member_avatar;
								reply.member_name = state.user.member_name;
								return reply;
							});

	return action.wrapList;
}

function receiveUserAvatarAndNameToReplyList(state, action){
	state.replyListExt.wrapList.list = state.replyListExt.wrapList.list.map( (reply, index, arr)=> {
											reply.member_avatar = action.user.member_avatar;
											reply.member_name = action.user.member_name;
											return reply;
									   });

	return state.replyListExt.wrapList;
}

