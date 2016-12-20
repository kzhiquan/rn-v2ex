import * as types from '../constants/ActionTypes';

//login, logout
export function userLogin(user){
	return {
		type: types.USER_LOGIN,
		user: user
	}
}

export function userLogout(user){
	return {
		type : types.USER_LOGOUT,
		user,
	}
}

export function endUserLogout(logoutSuccess){
	return {
		type : types.END_USER_LOGOUT,
		logoutSuccess,
	}
}


//Add User
export function addAccount(name, password){
	return {
		type : types.ADD_ACCOUNT,
		name,
		password
	};
}


export function endAddAccount(addSuccess){
	return {
		type : types.END_ADD_ACCOUNT,
		addSuccess,
	}
}


//the topic which the user created.
export function requestMyTopic(user){
	return {
		type: types.REQUEST_MY_TOPIC,
		user : user
	}
}

export function refreshMyTopic(user){
	return {
		type : types.REFRESH_MY_TOPIC,
		user : user
	}
}

export function requestMoreMyTopic(user, page){
	return {
		type : types.REQUEST_MORE_MY_TOPIC,
		user: user,
		page,
	}
}

export function receiveMyTopic(myTopic){
	return {
		type : types.RECEIVE_MY_TOPIC,
		myTopic : myTopic
	}
}


//the reply which the user created
export function requestMyReply(user){
	return {
		type: types.REQUEST_MY_REPLY,
		user : user
	}
}

export function refreshMyReply(user){
	return {
		type : types.REFRESH_MY_REPLY,
		user : user
	}
}

export function receiveMyReply(myReply){
	return {
		type : types.RECEIVE_MY_REPLY,
		myReply : myReply
	}
}


export function requestMoreMyReply(user, page){
	return {
		type : types.REQUEST_MORE_MY_REPLY,
		user: user,
		page,
	}
}


//the favorite topic the login user interested.
export function requestMyFavoriteTopic(path){
	return {
		type: types.REQUEST_MY_FAVORITE_TOPIC,
		path
	}
}

export function refreshMyFavoriteTopic(path){
	return {
		type : types.REFRESH_MY_FAVORITE_TOPIC,
		path,
	}
}

export function requestMoreMyFavoriteTopic(path, page){
	return {
		type : types.REQUEST_MORE_MY_FAVORITE_TOPIC,
		path,
		page,
	}
}

export function receiveMyFavoriteTopic(topicList, totalCount){
	return {
		type : types.RECEIVE_MY_FAVORITE_TOPIC,
		topicList,
		totalCount,
	}
}


//the notification the login user.
export function requestMyNotification(){
	return {
		type: types.REQUEST_MY_NOTIFICATION,
	}
}

export function refreshMyNotification(){
	return {
		type : types.REFRESH_MY_NOTIFICATION,
	}
}

export function requestMoreMyNotification(page){
	return {
		type : types.REQUEST_MORE_MY_NOTIFICATION,
		page,
	}
}

export function receiveMyNotification(notificationList, totalCount){
	return {
		type : types.RECEIVE_MY_NOTIFICATION,
		notificationList,
		totalCount,
	}
}

export function deleteMyNotification(notification){
	return {
		type : types.DELETE_MY_NOTIFICATION,
		notification,
	}
}

export function endDeleteMyNotification(notification) {
	return {
		type : types.END_DELETE_MY_NOTIFICATION,
		notification,
	}
}




//the favorite node the login user interested
export function requestMyNode(){
	return {
		type : types.REQUEST_MY_NODE,
	}
}

export function receiveMyNode(nodeList){
	return {
		type :  types.RECEIVE_MY_NODE,
		nodeList,
	}
}

