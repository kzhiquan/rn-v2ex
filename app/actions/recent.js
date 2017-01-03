import * as types from '../constants/ActionTypes';

//the topic which the user created.
export function requestRecentTopic(wrapList){
	return {
		type: types.REQUEST_RECENT_TOPIC,
		wrapList,
	}
}

export function refreshRecentTopic(wrapList){
	return {
		type : types.REFRESH_RECENT_TOPIC,
		wrapList,
	}
}

export function requestMoreRecentTopic(wrapList, page){
	return {
		type : types.REQUEST_MORE_RECENT_TOPIC,
		wrapList, 
		page,
	}
}

export function receiveRecentTopic(wrapList){
	return {
		type : types.RECEIVE_RECENT_TOPIC,
		wrapList,
	}
}