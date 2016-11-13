import * as types from '../constants/ActionTypes';


export function userLogin(user){
	return {
		type: types.USER_LOGIN,
		user: user
	}
}


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

export function receiveMyTopic(myTopic){
	return {
		type : types.RECEIVE_MY_TOPIC,
		myTopic : myTopic
	}
}


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