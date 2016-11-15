
import * as types from '../constants/ActionTypes';


export function nodeTopicPageInit(){
	return{
		type : types.NODE_TOPIC_PAGE_INIT
	}
}

export function requestTopic(isRefreshing, isLoading, isLoadingMore, path, page=1){
	return {
		type : types.REQUEST_TOPIC,
		isRefreshing,
		isLoading,
		isLoadingMore,
		path,
		page,
	};
}


export function receiveTopic(topicList, path){
	return {
		type : types.RECEIVE_TOPIC,
		topicList,
		path,
	}
}
