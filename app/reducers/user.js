import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

const initialState = {
	isLoading : false,
	user : null,
}

export default function user(state = initialState, action){
	switch(action.type){
		case types.REQUEST_USER:
			return Object.assign({}, state, {
				isLoading : true,
			} );

		case types.RECEIVE_USER:
			return Object.assign({}, state, { 
				isLoading : false,
				user : action.user,
			} );
		default:
			return state;
	}
}