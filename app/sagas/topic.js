import { put, take, call, fork } from 'redux-saga/effects'

import * as types from '../constants/ActionTypes';
import { topicRequest, topicReceive } from '../actions/topic';


export function* fetch_topic(isRefreshing, isLoading){
	try{
		console.log('isRefreshing', isRefreshing, 'isLoading', isLoading);
		//fetch_topic for
		function fetch_topic_list(){
			return new Promise((resolve, reject) => {
				data = [
						{
							member_url : '/member/zyq2280539',
							member_name : 'zyq2280539',
							member_avatar : 'https://cdn.v2ex.co/avatar/89a8/ae08/126149_normal.png?m=1477459343',
							topic_url : '/t/316557#reply56',
							topic_title : '面对着各种网盘的关闭，树莓派放置家中能做什么用？',
							node_url : '/go/programmer',
							node_name : '程序员',
							date : '几秒前',
							latest_reply_member_name: 'jigloo',
							latest_reply_menber_url : '/member/jigloo',
							reply_count : '56',
							reply_url : '/t/316557#reply56'
						}, 
						{
							member_url : '/member/zyq2280539',
							member_name : 'zyq2280539',
							member_avatar : '//cdn.v2ex.co/avatar/89a8/ae08/126149_normal.png?m=1477459343',
							topic_url : '/t/316557#reply56',
							topic_title : '面对着各种网盘的关闭，树莓派放置家中能做什么用？',
							node_url : '/go/programmer',
							node_name : '程序员',
							date : '几秒前',
							latest_reply_member_name: 'jigloo',
							latest_reply_menber_url : '/member/jigloo',
							reply_count : '56',
							reply_url : '/t/316557#reply56'
						},
						{
							member_url : '/member/zyq2280539',
							member_name : 'zyq2280539',
							member_avatar : '//cdn.v2ex.co/avatar/89a8/ae08/126149_normal.png?m=1477459343',
							topic_url : '/t/316557#reply56',
							topic_title : '面对着各种网盘的关闭，树莓派放置家中能做什么用？',
							node_url : '/go/programmer',
							node_name : '程序员',
							date : '几秒前',
							latest_reply_member_name: 'jigloo',
							latest_reply_menber_url : '/member/jigloo',
							reply_count : '56',
							reply_url : '/t/316557#reply56'
						}
				];

				setTimeout(function(){
					resolve(data);
				}, 5000);
			});
		}
		const topicList = yield call(fetch_topic_list); 
		//console.log('topicList', topicList);
		yield put(topicReceive(topicList));

	} catch ( error ){

		console.log('error:', error);
	}
}



export function* watchTopic(){
	while (true) {
		const { isRefreshing, isLoading } = yield take(types.TOPIC_REQUEST);
		yield fork(fetch_topic, isRefreshing, isLoading);
	}
}