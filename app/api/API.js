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



