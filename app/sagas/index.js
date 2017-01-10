

import { fork } from 'redux-saga/effects';

import { watchTest } from './test';
import { watchTopicList } from './topicList';
import { 
	watchTopic, 
	watchFavoriteTopic,
	watchThankTopic, 
	watchReplyTopic,
	watchThankReply, 
} from './topic';

import { 
	watchAuthTopic, 
	watchAuthReply,
	watchAuthNode, 
	wathChangeUser,
	watchAddAccount,
	watchAuthFavoriteTopic,
	watchAuthFocusPerson,
	watchAuthNotification,
	watchDeleteNotification,
	watchLogout, 
	watchUserMeta,
} from './auth';

import { 
	watchNodeList,
	watchNodePage, 
	watchFavoriteNode,
} from './node';

import { 
	watchUser, 
	watchUserTopicList,
	watchUserReplyList,
	watchFocusUser, 
	watchBlockUser,
} from './user'


import { 
	watchSearch,
	watchNodeSearch,
} from './search';

import { 
	watchFetchNewTopic,
	watchPostNewTopic,
} from './newTopic';

import {
	watchRecentTopic,
} from './recent';

export default function* rootSaga(){
	yield[
		fork(watchTest),
		fork(watchTopicList),

		fork(watchTopic),
		fork(watchFavoriteTopic),
		fork(watchThankTopic),
		fork(watchReplyTopic),
		fork(watchThankReply),

		fork(watchLogout),
		fork(watchAddAccount),
		fork(watchAuthTopic),
		fork(watchAuthReply),
		fork(watchAuthNode),
		fork(wathChangeUser),
		fork(watchAuthFavoriteTopic),
		fork(watchAuthFocusPerson),
		fork(watchAuthNotification),
		fork(watchDeleteNotification),
		fork(watchUserMeta),
		
		fork(watchNodeList),
		fork(watchNodePage),
		fork(watchFavoriteNode),

		fork(watchUser),
		fork(watchUserTopicList),
		fork(watchUserReplyList),
		fork(watchFocusUser),
		fork(watchBlockUser),

		fork(watchSearch),
		fork(watchNodeSearch),

		fork(watchFetchNewTopic),
		fork(watchPostNewTopic),

		fork(watchRecentTopic),
	]
}