import * as types from '../constants/ActionTypes'

const initialState = {
	accounts: {},
	checkAccount:{name:'', password:''},
	user:false,
	isChecking:false,
	isEnd:false
}


export default function auth(state = initialState, action){
	switch(action.type){
		case types.ACCOUNT_ADD:
			var checkAccount = {
				name:action.name,
				password:action.password
			};
			//Object.assign(state.accounts, account);
			return Object.assign({}, state, {checkAccount:checkAccount})

		case types.ACCOUNT_DELETE:
			delete state.accounts[action.name];
			return state;

		case types.USER_RECEIVE:
			return Object.assign({}, state, {user:action.user});

		case types.USER_CHECK_START:
			return Object.assign({}, state, {isChecking:action.isChecking});

		case types.USER_CHECK_END:
			if(action.user && action.user.name === state.checkAccount.name){
				state.accounts[action.checkAccount.name] = action.checkAccount;
			}
			return Object.assign({}, state, {isChecking:action.isChecking});

		default:
			return state;
	}
}