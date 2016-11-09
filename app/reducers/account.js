import * as types from '../constants/ActionTypes'

const initialState = {
	'kzhiquan' : 'kzhiquan62286507',
	'aa' : 'bbb'
}


export default function auth(state = initialState, action){
	switch(action.type){
		case types.ACCOUNT_ADD:
			var account = {}
			account[action.name] = action.password
			return Object.assign({}, state, account);
		case types.ACCOUNT_DELETE:
			delete state[action.name]
			return Object.assign({}, state);
		default:
			return state;
	}
}