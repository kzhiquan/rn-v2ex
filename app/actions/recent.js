import * as types from '../constants/ActionTypes';

//the topic which the user created.
export function requestRecentTopic(wrapList, path='/recent'){
	return {
		type: types.REQUEST_RECENT_TOPIC,
		wrapList,
		path,
	}
}

export function refreshRecentTopic(wrapList, path='/recent'){
	return {
		type : types.REFRESH_RECENT_TOPIC,
		wrapList,
		path,
	}
}

export function requestMoreRecentTopic(wrapList, path='/recent', page=1){
	return {
		type : types.REQUEST_MORE_RECENT_TOPIC,
		wrapList, 
		path,
		page,
	}
}

export function receiveRecentTopic(wrapList){
	return {
		type : types.RECEIVE_RECENT_TOPIC,
		wrapList,
	}
}