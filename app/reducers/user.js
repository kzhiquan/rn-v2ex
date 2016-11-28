import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

const initialState = {

	isLoading : false,
	user : null,

	isTopicListLoading : false,
	isTopicListLoadingMore : false,
	topicList : null,

	isReplyListLoading : false,
	isReplyListLoadingMore : false,
	replyList : null,

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
			} );

		case types.REQUEST_USER_TOPIC_LIST:
			if (action.page == 1 ){
				return Object.assign({}, state, {
					isTopicListLoading : true,
				});
			}else{
				return Object.assign({}, state, {
					isTopicListLoadingMore : true,
				});
			}

		case types.RECEIVE_USER_TOPIC_LIST:
			return Object.assign({}, state, {
				isTopicListLoading : false,
				isTopicListLoadingMore : false,
				topicList: state.isTopicListLoadingMore ? loadMoreTopic(state, action) : combineTopic(state, action),
			});

		case types.REQUEST_USER_REPLY_LIST:
			if (action.page == 1){
				return Object.assign({}, state, {
					isReplyListLoading : true,
				});	
			}else{
				return Object.assign({}, state, {
					isReplyListLoadingMore : true,
				})
			}

		case types.RECEIVE_USER_REPLY_LIST:
			return Object.assign({}, state, {
				isReplyListLoading : false,
				isReplyListLoadingMore : false,
				replyList: state.isReplyListLoadingMore ? loadMoreReply(state, action) : combineReply(state, action),
			});

		default:
			return state;
	}
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

