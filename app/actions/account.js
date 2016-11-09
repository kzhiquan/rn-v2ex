import * as types from '../constants/ActionTypes';

export function accountAdd(name, password){
	return {
		type : types.ACCOUNT_ADD,
		name,
		password
	};
}

export function accountDelete(name){
	return {
		type : types.ACCOUNT_DELETE,
		name
	}
}


export function userReceive(user){
	return {
		type: types.USER_RECEIVE,
		user: user
	}
}