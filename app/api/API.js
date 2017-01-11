import cheerio from 'cheerio-without-node-native';
import qs from 'qs';

import SITE from '../constants/Config';


//index page category node
export function parseCategoryNode($){
	let categoryNodeList = [];
	$('#Main .box').eq(1).children('.cell').each(function(){
		let nodeList = [];
		let category = $(this).find('table tr td .fade').first().text();
		if(category){
			$(this).find('table tr td a').each(function(){
				let node = {};
				node.category = category;
				node.name = $(this).text();
				node.path = $(this).attr('href');
				nodeList.push(node);
			})
			categoryNodeList.push({
				category : category,
				nodeList : nodeList,
			})
		}
	});

	return categoryNodeList;
}

//login user information
export function parseUser($){
	let user = {};
	user['logout_url'] = $('.content td a[href="#;"]').first().attr('onclick').match(/\/signout\?once=\d+/i)[0];
	user['name'] = $('.content td a').eq(2).text();
	user['member_url'] = $('.content td a').eq(2).attr('href');
	user['avatar_url'] = 'https:' + $('#Rightbar .box .cell table tr td img[class="avatar"]').attr('src');
	
	user['words'] = $('#Rightbar .box').first().find('.cell').first().find('table').first().find('tr td .fade').first().text();
	
	user['favorite_node_count'] = $('#Rightbar .box td[width="33%"] .bigger').eq(0).text();
	user['favorite_topic_count'] = $('#Rightbar .box td[width="34%"] .bigger').eq(0).text();
	user['focus_user_count'] = $('#Rightbar .box td[width="33%"] .bigger').eq(1).text();
	
	user['notification_count'] = $('#Rightbar a[href="/notifications"]').first().text().replace(' 条未读提醒', '');
	//console.log($('#Rightbar #money a').text().split(' '));
	user['silver_count'] = $('#Rightbar #money a').text().split(' ')[0];
	user['gold_count'] = $('#Rightbar #money a').text().split(' ')[2];

	return user;
}

//common node page topicList
export function parseNodeTopicList($, currentNode){
	let topicList = [];
	$('#TopicsNode').children('.cell').each(function(i, el){
		topic = {};
		topic.member_url = $(this).find('.small strong a').first().attr('href');
		topic.member_name = $(this).find('.small strong a').first().text();
		topic.member_avatar = 'https:' + $(this).find('td[width="48"] img').first().attr('src');
		topic.topic_url = $(this).find('.item_title a').first().attr('href');
		topic.topic_title = $(this).find('.item_title a').first().text();
		topic.node_url = currentNode.path;
		topic.node_name = currentNode.name;
		topic.node_favorite_url = currentNode.favorite_url;
		topic.latest_reply_date = $(this).find('.small').text().split('•')[1];
		topic.latest_reply_member_name = $(this).find('.small strong a').eq(1).text();
		topic.latest_reply_menber_url = $(this).find('.small strong a').eq(1).attr('href');
		topic.reply_count = $(this).find('td[width="50"] a').first().text();
		topic.reply_url = $(this).find('td[width="50"] a').first().attr('href');
		topicList.push(topic);
	});

	return topicList;
}

//recent page topicList
export function parseRecentTopicList($){
	let topicList = [];
	$('.box').children('.item').each(function(i, el){
		topic = {};
		topic.member_url = $(this).find('.small strong a').first().attr('href');
		topic.member_name = $(this).find('.small strong a').first().text();
		topic.member_avatar = 'https:' + $(this).find('td[width="48"] img').first().attr('src');
		topic.topic_url = $(this).find('.item_title a').first().attr('href');
		topic.topic_title = $(this).find('.item_title a').first().text();
		topic.node_url = $(this).find('.node').first().attr('href');
		topic.node_name = $(this).find('.node').first().text();
		topic.latest_reply_date = $(this).find('.small').text().split('•')[2];
		topic.latest_reply_member_name = $(this).find('.small strong a').eq(1).text();
		topic.latest_reply_menber_url = $(this).find('.small strong a').eq(1).attr('href');
		topic.reply_count = $(this).find('td[width="70"] a').first().text();
		topic.reply_url = $(this).find('td[width="70"] a').first().attr('href');
		topicList.push(topic);
	});

	return topicList;
}


export function parseUserTopicList($){
	let topicList = [];
	$('.box').children('.item').each(function(i, el){
		//console.log(i);
		topic = {}
		topic.member_url = $(this).find('.small strong a').first().attr('href');
		topic.member_name = $(this).find('.small strong a').first().text();
		topic.topic_url = $(this).find('.item_title a').first().attr('href');
		topic.topic_title = $(this).find('.item_title a').first().text();
		topic.node_url = $(this).find('.node').first().attr('href');
		topic.node_name = $(this).find('.node').first().text();

		//console.log($(this).find('.small'), $(this).find('.small strong a'), $(this).find('td[width="70"] a'));
		topic.latest_reply_date = $(this).find('.small').text().split('•')[2];
		if(topic.latest_reply_date){
			topic.latest_reply_date = topic.latest_reply_date.replace(' ', '');
		}

		topic.latest_reply_member_name = $(this).find('.small strong a').eq(1).text();
		topic.latest_reply_menber_url = $(this).find('.small strong a').eq(1).attr('href');

		topic.reply_count = $(this).find('td[width="70"] a').first().text();
		topic.reply_url = $(this).find('td[width="70"] a').first().attr('href');

		topicList.push(topic);

	});
	return topicList;
}

export function parseUserReplyList($){
	let replyList = [];
	$('.box').children('.dock_area').each(function(i, el){
		let reply = {};
		reply.topic = {};
		reply.date = $(this).find('.fr span').first().text();
		reply.topic.topic_title = $(this).find('.gray').first().text();
		reply.topic.topic_url = $(this).find('.gray a').first().attr('href');
		reply.content = $(this).next('div').find('.reply_content').first().html();
		if(reply.topic.topic_title){
			replyList.push(reply);
		}
	});
	return replyList;
}



