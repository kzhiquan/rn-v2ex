import * as types from '../constants/ActionTypes'

const initialState = {
	isLogining : false,
	accessToken: null,
	user:null
}


export default function auth(state = initialState, action){
	switch(action.type){
		case types.USER_LOGIN:
			return Object.assign({}, state, { 
				isLogining : action.isLogining
			} );
		case types.USER_LOGOUT:
			return Object.assign({}, state, { 
				isLogining : false
			} );
		default:
			return state;
	}
}