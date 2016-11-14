import * as types from '../constants/ActionTypes'

const initialState = {
	user:null,
	isLoading : true,
	isRefreshing : false
}


export default function auth(state = initialState, action){
	switch(action.type){
		//Login
		case types.USER_LOGIN:
			return Object.assign({}, state, { 
				user : action.user
			} );

		case types.USER_LOGOUT:
			return Object.assign({}, state, {
				user : null,
			} );
	
		//Topic
		case types.REQUEST_MY_TOPIC:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.REFRESH_MY_TOPIC:
			return Object.assign({}, state, {
				isRefreshing : true
			});

		case types.RECEIVE_MY_TOPIC:
			return Object.assign({}, state, {
				isLoading : false,
				isRefreshing : false,
				myTopic : action.myTopic,
			});

		//Reply
		case types.REQUEST_MY_REPLY:
			return Object.assign({}, state, {
				isLoading : true,
			});

		case types.REFRESH_MY_REPLY:
			return Object.assign({}, state, {
				isRefreshing : true
			});

		case types.RECEIVE_MY_REPLY:
			return Object.assign({}, state, {
				isLoading : false,
				isRefreshing : false,
				myReply : action.myReply,
			});

		default:
			return state;
	}
}