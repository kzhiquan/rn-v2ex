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


export function startFavoriteTopic(favoriteUrl){
	return {
		type : types.START_FAVORITE_TOPIC,
		favoriteUrl
	}
}

export function endFavoriteTopic(){
	return {
		type : types.END_FAVORITE_TOPIC,
	}
}


export function startThankTopic(thankUrl){
	return {
		type : types.START_THANK_TOPIC,
		thankUrl,
	}
}

export function endThankTopic(){
	return {
		type : types.END_THANK_TOPIC,
	}
}

export function startReplyTopic(topicUrl, once, content){
	return {
		type : types.START_REPLY_TOPIC,
		topicUrl, 
		once,
		content,
	}
}

export function endReplyTopic(){
	return {
		type : types.END_REPLY_TOPIC,
	}
}



export function startThankReply(thankUrl){
	return {
		type : types.START_THANK_REPLY,
		thankUrl,
	}
}

export function endThankReply(thankUrl){
	return {
		type : types.END_THANK_REPLY,
	}
}


