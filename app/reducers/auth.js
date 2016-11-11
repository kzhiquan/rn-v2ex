import * as types from '../constants/ActionTypes'

const initialState = {
	user:null
}


export default function auth(state = initialState, action){
	switch(action.type){
		case types.USER_LOGIN:
			return Object.assign({}, state, { 
				user : action.user
			} );
		case types.USER_LOGOUT:
			return Object.assign({}, state, {
			} );
		default:
			return state;
	}
}