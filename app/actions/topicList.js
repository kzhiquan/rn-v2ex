import * as types from '../constants/ActionTypes';



export function requestTopicList(isRefreshing, isLoading, isLoadingMore, path, page=1){
	return {
		type : types.REQUEST_TOPIC_LIST,
		isRefreshing,
		isLoading,
		isLoadingMore,
		path,
		page,
	};
}


export function receiveTopicList(topicList, path){
	return {
		type : types.RECEIVE_TOPIC_LIST,
		topicList,
		path,
	}
}
