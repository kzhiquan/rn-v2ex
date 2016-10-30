import * as types from '../constants/ActionTypes'

const initialState = {
	isLoading : false,
	content : 'topic content'
}


export default function topic(state = initialState, action){
	switch(action.type){
		case types.TOPIC_REQUEST:
			return Object.assign({}, state, { content : 'topic request', isLoading: true} );
		case types.TOPIC_RECEIVE:
			return Object.assign({}, state, { content : 'topic receive', isLoading: false} );
		default:
			return state;
	}
}