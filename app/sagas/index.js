

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

import { watchAccount } from './account';
import { 
	watchAuthTopic, 
	watchAuthReply,
	watchAuthNode, 
	wathChangeUser,
	watchAuthFavoriteTopic,
	watchAuthNotification,
	watchDeleteNotification, 
} from './auth';

import { watchNodeList } from './nodeList';

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

		fork(watchAccount),
		fork(watchAuthTopic),
		fork(watchAuthReply),
		fork(watchAuthNode),
		fork(wathChangeUser),
		fork(watchAuthFavoriteTopic),
		fork(watchAuthNotification),
		fork(watchDeleteNotification),
		
		fork(watchNodeList),

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