import * as types from '../constants/ActionTypes';



/*export function requestTopic(isRefreshing, isLoading, isLoadingMore, topic, page=1){
	return {
		type : types.REQUEST_TOPIC,
		isRefreshing,
		isLoading,
		isLoadingMore,
		topic,
		page,
	};
}*/

export function requestTopic(wrapList, path, page=1){
	return {
		type : types.REQUEST_TOPIC,
		wrapList,
		path, 
		page,
	}
}

export function refreshTopic(wrapList, path, page=1){
	return {
		type : types.REFRESH_TOPIC,
		wrapList,
		path, 
		page,
	}
}

export function loadMoreTopic(wrapList, path, page=1){
	return {
		type : types.LOAD_MORE_TOPIC,
		wrapList,
		path, 
		page,
	}
}


/*export function receiveTopic(topic){
	return {
		type : types.RECEIVE_TOPIC,
		topic
	}
}*/

export function receiveTopic(wrapList){
	return {
		type : types.RECEIVE_TOPIC,
		wrapList
	}
}



export function startFavoriteTopic(topic){
	return {
		type : types.START_FAVORITE_TOPIC,
		topic, 
	}
}

export function endFavoriteTopic(topic){
	return {
		type : types.END_FAVORITE_TOPIC,
		topic,
	}
}


export function startThankTopic(thankUrl){
	return {
		type : types.START_THANK_TOPIC,
		thankUrl,
	}
}

export function endThankTopic(result){
	return {
		type : types.END_THANK_TOPIC,
		result,
	}
}



export function startReplyTopic(wrapList,content){
	return {
		type : types.START_REPLY_TOPIC,
		wrapList,
		content,
	}
}

export function endReplyTopic(result){
	return {
		type : types.END_REPLY_TOPIC,
		result,
	}
}



export function startThankReply(reply){
	return {
		type : types.START_THANK_REPLY,
		reply,
	}
}

export function endThankReply(reply){
	return {
		type : types.END_THANK_REPLY,
		reply
	}
}


