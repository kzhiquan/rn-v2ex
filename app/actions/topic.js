
import * as types from '../constants/ActionTypes';

export function topicRequest(){
	return {
		type : types.TOPIC_REQUEST
	};
}

export function topicReceive(){
	return {
		type : types.TOPIC_RECEIVE
	}
}
