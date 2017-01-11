import * as types from '../constants/ActionTypes';

//the topic which the user created.
export function requestRecentTopic(list, path='/recent'){
	return {
		type: types.REQUEST_RECENT_TOPIC,
		list,
		path,
	}
}

export function refreshRecentTopic(list, path='/recent'){
	return {
		type : types.REFRESH_RECENT_TOPIC,
		list,
		path,
	}
}

export function requestMoreRecentTopic(list, path='/recent', page=1){
	return {
		type : types.REQUEST_MORE_RECENT_TOPIC,
		list, 
		page,
	}
}

export function receiveRecentTopic(list){
	return {
		type : types.RECEIVE_RECENT_TOPIC,
		list,
	}
}