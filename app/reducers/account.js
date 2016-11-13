import * as types from '../constants/ActionTypes'

const initialState = {
	accounts: new Map(),

	checkAccount:{name:'', password:''},
	user:false,
	isChecking:false,

	editAccount:null
}


export default function auth(state = initialState, action){
	console.log('state', state);
	switch(action.type){
		case types.ADD_ACCOUNT_PAGE_INIT:
			return Object.assign({}, state, {
				checkAccount:{name:'', password:''},
				user:false,
				isChecking:false
			});

		case types.EDIT_ACCOUNT_PAGE_INIT:
			return Object.assign({}, state,{
				editAccount:action.editAccount,
				checkAccount:{name:'', password:''},
				user:false,
				isChecking:false
			});

		case types.ACCOUNT_ADD:
			var checkAccount = {
				name:action.name,
				password:action.password
			};
			return Object.assign({}, state, {checkAccount:checkAccount});

		case types.ACCOUNT_DELETE:
			state.accounts.delete(action.name);
			return Object.assign({}, state);

		case types.USER_RECEIVE:
			return Object.assign({}, state, {user:action.user});

		case types.USER_CHECK_START:
			return Object.assign({}, state, {isChecking:true});

		case types.USER_CHECK_END:
			if(state.user && state.user.name === state.checkAccount.name){
				state.user['password'] = state.checkAccount.password
				state.accounts.set(state.checkAccount.name, state.user);
			}
			return Object.assign({}, state, {isChecking:false});

		default:
			return state;
	}
}