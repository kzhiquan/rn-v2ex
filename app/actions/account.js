import * as types from '../constants/ActionTypes';


export function addAccountPageInit(){
	return {
		type: types.ADD_ACCOUNT_PAGE_INIT
	}
}

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


export function userCheckStart(){
	return{
		type: types.USER_CHECK_START
	}
}

export function userReceive(user){
	return {
		type: types.USER_RECEIVE,
		user: user
	}
}

export function userCheckEnd(){
	return{
		type: types.USER_CHECK_END
	}
}