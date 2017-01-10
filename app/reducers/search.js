import {REHYDRATE} from 'redux-persist/constants'
import * as types from '../constants/ActionTypes'

const initialState = {
	isSearching : false,
	isRefreshing : false,
	isLoadingMore : false,
	searchResult : null,
	nodeList : [],
	searchNodeResult:[],
	history : {
		topic: [],
		node : [],
	},
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

		case types.START_NODE_SEARCH:
			return Object.assign({}, state, { 
				isSearching : true,
			});

		case types.END_NODE_SEARCH:
			return Object.assign({}, state, { 
				isSearching : false,
				nodeList : action.nodeList,
				searchNodeResult : findNode(state, action),
			});

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
				//history : action.payload.search ? action.payload.search.history : {},
				history : {
					topic: [],
					node : [],
				}
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
	let searchTargethistory = state.history[action.searchTarget]
	let exist = searchTargethistory.find((text) => text === action.searchText);
	if(!exist){
		searchTargethistory.unshift(action.searchText);
		state.history[action.searchTarget] = searchTargethistory;
	}
	return state.history;
}

function removeHistory(state, action){
	console.log('state', state, 'action', action, 'history', state.history);
	let searchTargethistory = state.history[action.searchTarget]
	state.history[action.searchTarget] =  searchTargethistory.filter( item => item !== action.searchText );
	return state.history;
}


function findNode(state, action){

	if(!action.nodeList){
		return [];
	}

	return action.nodeList.filter( node => {
		let reg = new RegExp(action.searchText, 'i');
		return reg.test(node.name);
	});
}











