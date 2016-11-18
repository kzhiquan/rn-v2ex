import * as types from '../constants/ActionTypes';



export function requestUser(path){
	return {
		type : types.REQUEST_USER,
		path,
	};
}


export function receiveUser(user){
	return {
		type : types.RECEIVE_USER,
		user : user,
	}
}