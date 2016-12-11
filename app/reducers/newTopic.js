import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'


const initialState = {
	isLoading : false,
	nodes : [],
	once : '',
	topic_url : ''
}


export default function newTopic(state = initialState, action){
	switch(action.type){

		case types.REQUEST_NEW_TOPIC:
			return Object.assign({}, state, { 
				isLoading : true,
				topic_url : '',
			} );

		case types.RECEIVE_NEW_TOPIC:
			return Object.assign({}, state, {
				isLoading : false,
				nodes : action.nodes,
				once : action.once,
			});
		case types.POST_NEW_TOPIC:
			return Object.assign({}, state, {
				isLoading : true,
				topic_url : '',
			});
		case types.END_POST_NEW_TOPIC:
			return Object.assign({}, state, {
				isLoading : false,
				topic_url : action.topic_url,
			});

		case REHYDRATE:
			return Object.assign({}, state, {
				isLoading:false,
			});

		default:
			return state;
	}
}

