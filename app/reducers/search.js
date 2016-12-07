import * as types from '../constants/ActionTypes'

const initialState = {
	isSearching : false,
	isRefreshing : false,
	isLoadingMore : false,
	searchResult : null,
	history : [],
}


export default function search(state = initialState, action){
	switch(action.type){

		case types.START_SEARCH:
			return Object.assign({}, state, { 
				isSearching : true,
			});

		case types.REFRESH_SEARCH:
			return Object.assign({}, state, {
				isRefreshing : true,
			})

		case types.SEARCH_NEXT_PAGE:
			return Object.assign({}, state, {
				isLoadingMore : true,
			})

		case types.RECEIVE_SEARCH:
			return Object.assign({}, state, { 
				isSearching : false,
				isRefreshing : false,
				isLoadingMore : false,
				searchResult : action.searchResult,
			});
		case types.SEARCH_PAGE_CLOSE:
			return Object.assign({}, state, {
				isSearching : false,
				isRefreshing : false,
				isLoadingMore : false,
				searchResult : null,
			})
		default:
			return state;
	}
}