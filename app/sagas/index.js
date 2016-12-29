

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
} from './auth';

import { 
	watchNodeList,
	watchNodePage, 
} from './nodeList';

import { 
	watchUser, 
	watchUserTopicList,
	watchUserReplyList,
	watchFocusUser, 
	watchBlockUser,
} from './user'


import { watchSearch } from './search';

import { 
	watchFetchNewTopic,
	watchPostNewTopic,
} from './newTopic';

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
		
		fork(watchNodeList),
		fork(watchNodePage),

		fork(watchUser),
		fork(watchUserTopicList),
		fork(watchUserReplyList),
		fork(watchFocusUser),
		fork(watchBlockUser),

		fork(watchSearch),

		fork(watchFetchNewTopic),
		fork(watchPostNewTopic),
	]
}