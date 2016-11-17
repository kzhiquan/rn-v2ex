import * as types from '../constants/ActionTypes'

const initialState = {
	user:null,
	isLoading : true,
	isRefreshing : false,
	isLoadingMore : false,
	myTopic:null,
	myReply:null,
}


export default function auth(state = initialState, action){
	switch(action.type){
		//Login
		case types.USER_LOGIN:
			return Object.assign({}, state, { 
				user : action.user
			} );

		case types.USER_LOGOUT:
			return Object.assign({}, state, {
				user : null,
			} );
	
		//Topic
		case types.REQUEST_MY_TOPIC:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.REQUEST_MORE_MY_TOPIC:
			return Object.assign({}, state, {
				isLoadingMore : true,
			})

		case types.REFRESH_MY_TOPIC:
			return Object.assign({}, state, {
				isRefreshing : true
			});

		case types.RECEIVE_MY_TOPIC:
			return Object.assign({}, state, {
				isLoading : false,
				isRefreshing : false,
				isLoadingMore : false,
				myTopic : state.isLoadingMore ? loadMoreTopic(state, action) : combineTopic(state, action),
			});

		//Reply
		case types.REQUEST_MY_REPLY:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.REQUEST_MORE_MY_REPLY:
			return Object.assign({}, state, {
				isLoadingMore : true,
			})

		case types.REFRESH_MY_REPLY:
			return Object.assign({}, state, {
				isRefreshing : true
			});

		case types.RECEIVE_MY_REPLY:
			return Object.assign({}, state, {
				isLoading : false,
				isRefreshing : false,
				isLoadingMore: false,
				myReply : state.isLoadingMore ? loadMoreReply(state, action) : combineReply(state, action),
			});

		default:
			return state;
	}
}


function combineTopic(state, action) {
	return action.myTopic;
}

function loadMoreTopic(state, action, countPerPage=20) {
	if(state.myTopic.topicList.length % countPerPage == 0){
		state.myTopic.topicList = state.myTopic.topicList.concat(action.myTopic.topicList);
	}
	
  	return state.myTopic;
}

function combineReply(state, action) {
	return action.myReply;
}

function loadMoreReply(state, action) {
	let currentCount = state.myReply.replyList.length;
	let incrementCount = action.myReply.replyList.length;
	let currentLastReply = state.myReply.replyList[currentCount-1];
	let increntLastReply = action.myReply.replyList[incrementCount-1];
	if( currentLastReply.topic.topic_url != increntLastReply.topic.topic_url ||
		currentLastReply.content != increntLastReply.content){
		state.myReply.replyList = state.myReply.replyList.concat(action.myReply.replyList);
	}
  	return state.myReply;
}

