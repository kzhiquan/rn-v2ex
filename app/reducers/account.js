import * as types from '../constants/ActionTypes'

const initialState = {
	accounts: {},
	user:null
}


export default function auth(state = initialState, action){
	switch(action.type){
		case types.ACCOUNT_ADD:
			var account = {};
			account[action.name] = action.password;
			Object.assign(state.accounts, account);
			return state;
		case types.ACCOUNT_DELETE:
			delete state.accounts[action.name];
			return state;
		case types.USER_RECEIVE:
			return Object.assign({}, state, {user:action.user});
		default:
			return state;
	}
}