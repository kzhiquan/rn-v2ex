
import * as types from '../constants/ActionTypes';

export function topicRequest(isRefreshing, isLoading){
	return {
		type : types.TOPIC_REQUEST,
		isRefreshing,
		isLoading
	};
}

export function topicReceive(topicList){
	return {
		type : types.TOPIC_RECEIVE,
		topicList
	}
}
