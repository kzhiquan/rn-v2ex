import {REHYDRATE} from 'redux-persist/constants'
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
				searchResult : state.isLoadingMore ? loadMore(state, action) : combine(state, action),
			});
		case types.SEARCH_PAGE_CLOSE:
			return Object.assign({}, state, {
				isSearching : false,
				isRefreshing : false,
				isLoadingMore : false,
				searchResult : null,
			})

		case types.ADD_SEARCH_HISTORY:
			return Object.assign({}, state, {
				history : addHistory(state, action),
			})

		case types.REMOVE_SEARCH_HISTORY:
			return Object.assign({}, state, {
				history : removeHistory(state, action),
			})

		case REHYDRATE:
			return Object.assign({}, state, {
				isSearching:false,
				isRefreshing:false,
				isLoadingMore:false,
				searchResult : null,
				history : action.payload.search ? action.payload.search.history : [],
			});
		default:
			return state;
	}
}


function combine(state, action) {
  state.searchResult = action.searchResult;
  if(state.searchResult.topicList.length == 0){
  	topic = {}
  	topic.topic_title = '搜索结果为空,请调整搜索字段!';
  	topic.brief_content = '';
  	state.searchResult.topicList.push(topic);
  }
  return state.searchResult;
}

function loadMore(state, action) {
  state.searchResult.topicList = state.searchResult.topicList.concat(action.searchResult.topicList);
  console.log(state.searchResult.nextPageUrl, action.searchResult.nextPageUrl);
  state.searchResult.nextPageUrl = action.searchResult.nextPageUrl;
  return state.searchResult;
}

function addHistory(state, action){
	let exist = state.history.find((text) => text === action.searchText);
	if(!exist){
		state.history.unshift(action.searchText);
	}
	return state.history;
}

function removeHistory(state, action){
	return state.history.filter( item => item !== action.searchText );
}