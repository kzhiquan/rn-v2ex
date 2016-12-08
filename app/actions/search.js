import * as types from '../constants/ActionTypes';



export function startSearch(searchText){
	return {
		type : types.START_SEARCH,
		searchText,
	}
}

export function refreshSearch(searchText){
	return {
		type : types.REFRESH_SEARCH,
		searchText,
	}
}

export function searchNextPage(searchText, nextPageUrl){
	return {
		type : types.SEARCH_NEXT_PAGE,
		searchText,
		nextPageUrl,
	}
}

export function receiveSearch(searchResult){
	return {
		type : types.RECEIVE_SEARCH,
		searchResult : searchResult,
	}
}

export function searchPageClose(){
	return {
		type : types.SEARCH_PAGE_CLOSE,
	}
}


export function addSearchHistory(searchText){
	return {
		type : types.ADD_SEARCH_HISTORY,
		searchText,
	}
}

export function removeSearchHistory(searchText){
	return {
		type : types.REMOVE_SEARCH_HISTORY,
		searchText,
	}
}