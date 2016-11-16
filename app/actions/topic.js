import * as types from '../constants/ActionTypes';



export function requestTopic(isRefreshing, isLoading, isLoadingMore, topic, page=1){
	return {
		type : types.REQUEST_TOPIC,
		isRefreshing,
		isLoading,
		isLoadingMore,
		topic,
		page,
	};
}


export function receiveTopic(topic){
	return {
		type : types.RECEIVE_TOPIC,
		topic
	}
}