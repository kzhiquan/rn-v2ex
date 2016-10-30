

import * as types from '../constants/ActionTypes'

const initialState = {
	content : 'test state'
}


export default function test(state = initialState, action){
	switch(action.type){
		case types.TEST_A:
			return Object.assign({}, state, { content : 'test state A'});
		case types.TEST_B:
			return Object.assign({}, state, { content : 'test state B'});
		default:
			return state;
	}
}