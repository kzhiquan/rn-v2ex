
import * as types from '../constants/ActionTypes';


export function nodeTopicPageInit(){
	return{
		type : types.NODE_TOPIC_PAGE_INIT
	}
}

export function requestTopic(isRefreshing, isLoading, isLoadingMore, path){
	return {
		type : types.REQUEST_TOPIC,
		isRefreshing,
		isLoading,
		isLoadingMore,
		path
	};
}


export function receiveTopic(topicList){
	return {
		type : types.RECEIVE_TOPIC,
		topicList
	}
}
