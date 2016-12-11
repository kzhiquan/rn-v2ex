import * as types from '../constants/ActionTypes';



export function requestNewTopic(){
	return {
		type : types.REQUEST_NEW_TOPIC,
	};
}


export function receiveNewTopic(nodes, once){
	return {
		type : types.RECEIVE_NEW_TOPIC,
		nodes,
		once,
	}
}

export function postNewTopic(title, content, node, once){
	return {
		type : types.POST_NEW_TOPIC,
		title,
		content,
		node,
		once,
	}
}

export function endPostNewTopic(topic_url){
	return {
		type : types.END_POST_NEW_TOPIC,
		topic_url,
	}
}