import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

const initialState = {

	isLoading : false,
	user : null,

	isTopicListLoading : false,
	isTopicListLoadingMore : false,
	topicList : null,

	topicListExt:{
		isLoading : false,
		isRefreshing : false,
		isLoadingMore : false,
		list : [],
	},

	isReplyListLoading : false,
	isReplyListLoadingMore : false,
	replyList : null,
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
					list : receiveUserAvatarToReplyList(state, action),
				}),
			} );

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
					list : receiveListAvatarToList(state, action),
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
					list : receiveListAvatarToList(state, action),
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
			return Object.assign({}, state, action.payload.user,{
				topicListExt:{
					isLoading : false,
					isRefreshing : false,
					isLoadingMore : false,
					list : [],
				},
			});

		default:
			return state;
	}
}


function receiveListAvatarToList(state, action){

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

function receiveUserAvatarToReplyList(state, action){
	return state.replyListExt.list.map( (topic, index, arr)=> {
				topic.member_avatar = action.user.member_avatar;
				return topic;
		   });
}



function combineTopic(state, action) {
	return action.topicList;
}

function loadMoreTopic(state, action, countPerPage=20) {
	if(state.topicList.topicList.length % countPerPage == 0){
		state.topicList.topicList = state.topicList.topicList.concat(action.topicList.topicList);
	}
	
  	return state.topicList;
}

function combineReply(state, action) {
	return action.replyList;
}

function loadMoreReply(state, action) {
	let currentCount = state.replyList.replyList.length;
	let incrementCount = action.replyList.replyList.length;
	let currentLastReply = state.replyList.replyList[currentCount-1];
	let increntLastReply = action.replyList.replyList[incrementCount-1];
	if( currentLastReply.topic.topic_url != increntLastReply.topic.topic_url ||
		currentLastReply.content != increntLastReply.content){
		state.replyList.replyList = state.replyList.replyList.concat(action.replyList.replyList);
	}
  	return state.replyList;
}

