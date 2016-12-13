import * as types from '../constants/ActionTypes'

const initialState = {
	user:null,
	isLoading : true,
	isRefreshing : false,
	isLoadingMore : false,
	myTopic:null,
	myReply:null,
	myNode:{
		isLoading : false,
		nodeList : [],
	},
	myFavoriteTopic:{
		isLoading:false,
		isRefreshing : false,
		isLoadingMore : false,
		topicList : [],
	},
	myNotification:{
		isLoading : false,
		isRefreshing : false,
		isLoadingMore : false,
		notificationList : false,
		deletedNotification : null,
	}
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

		//node
		case types.REQUEST_MY_NODE:
			return Object.assign({}, state, {
				myNode : {
					isLoading : true,
					nodeList : [],
				}
			})

		case types.RECEIVE_MY_NODE:
			return Object.assign({}, state, {
				myNode : {
					isLoading : false,
					nodeList : action.nodeList,
				}
			})

		//my favorite topic
		case types.REQUEST_MY_FAVORITE_TOPIC:

			return Object.assign({}, state, {
				myFavoriteTopic : Object.assign({}, state.myFavoriteTopic, {
					isLoading : true,
				}),
			});

		case types.REFRESH_MY_FAVORITE_TOPIC:

			return Object.assign({}, state, {
				myFavoriteTopic : Object.assign({}, state.myFavoriteTopic, {
					isRefreshing : true,
				}),
			});

		case types.REQUEST_MORE_MY_FAVORITE_TOPIC:

			return Object.assign({}, state, {
				myFavoriteTopic : Object.assign({}, state.myFavoriteTopic, {
					isLoadingMore : true,
				})
			})
		case types.RECEIVE_MY_FAVORITE_TOPIC:

			return Object.assign({}, state, {
				myFavoriteTopic : Object.assign({}, state.myFavoriteTopic,{
					isLoading : false,
					isRefreshing : false,
					isLoadingMore : false,
					topicList : state.myFavoriteTopic.isLoadingMore ? loadMoreFavoriteTopic(state, action) : combineFavoriteTopic(state, action),
					totalCount : action.totalCount,
				}),
			});

		//my notification
		case types.REQUEST_MY_NOTIFICATION:
			return Object.assign({}, state, {
				myNotification : Object.assign({}, state.myNotification, {
					isLoading : true,
				})
			});

		case types.REFRESH_MY_NOTIFICATION:
			return Object.assign({}, state, {
				myNotification : Object.assign({}, state.myNotification, {
					isRefreshing : true,
				})
			});

		case types.REQUEST_MORE_MY_NOTIFICATION:
			return Object.assign({}, state, {
				myNotification : Object.assign({}, state.myNotification,{
					isLoadingMore : true,
				})
			});

		case types.RECEIVE_MY_NOTIFICATION:
			return Object.assign({}, state, {
				myNotification : Object.assign({}, state.myNotification, {
					isLoading : false,
					isRefreshing : false,
					isLoadingMore : false,
					deletedNotification : null,
					notificationList : state.myNotification.isLoadingMore ? loadMoreNotificationList(state, action) : combineNotificationList(state, action),
					totalCount : action.totalCount,
				})
			});
		case types.DELETE_MY_NOTIFICATION:
			return Object.assign({}, state, {
				myNotification : Object.assign({}, state.myNotification,{
					isLoading : true,
					deletedNotification : null,
				})
			});

		case types.END_DELETE_MY_NOTIFICATION:{
			return Object.assign({}, state, {
				myNotification : Object.assign({}, state.myNotification, {
					isLoading : false,
					deletedNotification : action.notification,
				})
			});
		}

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



function combineFavoriteTopic(state, action) {
	return action.topicList;
}

function loadMoreFavoriteTopic(state, action, countPerPage=20) {
	if(state.myFavoriteTopic.topicList.length % countPerPage == 0){
		state.myFavoriteTopic.topicList = state.myFavoriteTopic.topicList.concat(action.topicList);
	}
	
  	return state.myFavoriteTopic.topicList;
}


function combineNotificationList(state, action) {
	return action.notificationList;
}

function loadMoreNotificationList(state, action, countPerPage=10) {
	if(state.myNotification.notificationList.length % countPerPage == 0){
		state.myNotification.notificationList = state.myNotification.notificationList.concat(action.notificationList);
	}
	
  	return state.myNotification.notificationList;
}

