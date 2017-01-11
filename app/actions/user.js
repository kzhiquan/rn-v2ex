import * as types from '../constants/ActionTypes';



export function requestUser(path){
	return {
		type : types.REQUEST_USER,
		path,
	};
}


export function receiveUser(user){
	return {
		type : types.RECEIVE_USER,
		user : user,
	}
}


/*export function requestUserTopicList(path, page=1){
	return {
		type : types.REQUEST_USER_TOPIC_LIST,
		path,
		page,
	}
}*/

export function requestUserTopicList(list, path, page=1){
	return {
		type: types.REQUEST_USER_TOPIC_LIST,
		list,
		path, 
		page
	}
}


export function receiveUserTopicList(list){
	return {
		type : types.RECEIVE_USER_TOPIC_LIST,
		list,
	}
}


export function requestUserReplyList(path, page=1){
	return {
		type : types.REQUEST_USER_REPLY_LIST,
		path, 
		page,
	}
}

export function receiveUserReplyList(replyList){
	return {
		type : types.RECEIVE_USER_REPLY_LIST,
		replyList : replyList,
	}
}

export function requestFocusUser(user){
	return {
		type : types.REQUEST_FOCUS_USER,
		user,
	}
}

export function endRequestFocusUser() {
	return {
		type : types.END_REQUEST_FOCUS_USER,
	}
}

export function requestBlockUser(user){
	return {
		type : types.REQUEST_BLOCK_USER,
		user,
	}
}

export function endRequestBlockUser(){
	return {
		type : types.END_REQUEST_BLOCK_USER,
	}
}

