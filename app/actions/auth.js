import * as types from '../constants/ActionTypes';


export function userLogin(user){
	return {
		type: types.USER_LOGIN,
		user: user
	}
}