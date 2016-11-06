
import * as types from '../constants/ActionTypes';

export function topicRequest(isRefreshing, isLoading, isLoadingMore, path){
	return {
		type : types.TOPIC_REQUEST,
		isRefreshing,
		isLoading,
		isLoadingMore,
		path
	};
}

export function topicReceive(topicList){
	return {
		type : types.TOPIC_RECEIVE,
		topicList
	}
}
