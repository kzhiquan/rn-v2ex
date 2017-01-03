import cheerio from 'cheerio-without-node-native'
import qs from 'qs'

import * as API from '../api/API'
import SITE from '../constants/Config'


export function fetchTopicListExt(wrapList, page=1){
  return new Promise((resolve, reject) => {

  	let url = SITE.HOST + wrapList.path;
  	console.log('url', url);
  	if(wrapList.path.indexOf('?') == -1){
  		url = SITE.HOST + wrapList.path + '?p=' + page;
  	}

  	console.log('url', url);
  	
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((body) => {

		const $ = cheerio.load(body);
		let newTopicList = API.parseRecentTopicList($);
		if( page == 1 ){
			wrapList.list = [].concat(newTopicList);
		}else{

			let firstNewTopic = newTopicList[0];
			let foundIndex = wrapList.list.findIndex( (topic, index, arr)=> {
				return topic.topic_url.split('#')[0] == firstNewTopic.topic_url.split('#')[0];
			});

			if(foundIndex >= 0){
				newTopicList.splice(0, wrapList.list.length-foundIndex);
			}

			wrapList.list = wrapList.list.concat(newTopicList);
		}
		resolve(wrapList);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function fetchTopicList(path, page=1){

  return new Promise((resolve, reject) => {

  	let url = SITE.HOST + path;
  	console.log('url', url);
  	if(path.indexOf('?') == -1){
  		url = SITE.HOST + path + '?p=' + page;
  	}
  	
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((body) => {
      	//console.log('body', body);
		topicList = []
		const $ = cheerio.load(body);

		//for recent node and index node
		$('.box').children('.item').each(function(i, el){
			//console.log(i);
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
		if(topicList.length != 0){
			resolve(topicList);
		}

		//for common node
		$('#TopicsNode').children('.cell').each(function(i, el){
			topic = {};
			topic.member_url = $(this).find('.small strong a').first().attr('href');
			topic.member_name = $(this).find('.small strong a').first().text();
			topic.member_avatar = 'https:' + $(this).find('td[width="48"] img').first().attr('src');
			topic.topic_url = $(this).find('.item_title a').first().attr('href');
			topic.topic_title = $(this).find('.item_title a').first().text();
			topic.node_url = $(this).find('.node').first().attr('href');
			topic.node_name = $(this).find('.node').first().text();
			topic.node_favorite_url = $('#Main .box .header .f12 a').attr('href');
			topic.latest_reply_date = $(this).find('.small').text().split('•')[1];
			topic.latest_reply_member_name = $(this).find('.small strong a').eq(1).text();
			topic.latest_reply_menber_url = $(this).find('.small strong a').eq(1).attr('href');
			topic.reply_count = $(this).find('td[width="50"] a').first().text();
			topic.reply_url = $(this).find('td[width="50"] a').first().attr('href');
			topicList.push(topic);
		});

		//console.log('topics length:', topics.length);
		resolve(topicList);
      })
      .catch((error) => {
        reject(error);
      });
  });


}

export function fetchTopic(topic, page=1){
	return new Promise( (resolve, reject) => {
		//console.log('topic', topic, 'page', page);
		let topicId = topic.topic_url.split('#')[0].split('t/')[1];
		let url = SITE.HOST + topic.topic_url.split('#')[0] + '?p=' + page;
		//console.log('url', url, topicId);

		fetch(url)
		.then( (response) => {
			return response.text();
		})
		.then( (body) => {
			//console.log(body);
			//console.log('page', page, 'topic', topic);
			const $ = cheerio.load(body);
			topic.topic_id = topicId;
			topic.topic_title = $('#Main .box .header h1').first().text();
			topic.topic_content = $('#Main .topic_content .markdown_body').html();
			if(!topic.topic_content){
				topic.topic_content = $('#Main .topic_content').html();
			}
			topic.vote_count = $('#topic_' + topicId + '_votes').find('a').first().text();
			topic.click_count = $('#Main .box .header .gray').first().text().split('·')[2];
			topic.post_date = $('#Main .box .header .gray').first().text().split('·')[1];

			if($('#Main .transparent .inner span').first().text() == '目前尚无回复'){
				topic.reply_count = 0;
			}else{
				topic.reply_count = $('#Main .box .cell .gray').first().text().split('回复')[0].replace(' ', '');
			}
			//this part, should the user have login in, but not conside the own topic.
			//console.log($('#Main .topic_buttons').html())
			if($('#Main .topic_buttons').html()){

				topic.collect_count =$('#Main .topic_buttons .fr').first().text().split('∙')[1];
				let favorite_text = $('#Main .topic_buttons a').first().text();
				if(favorite_text === '加入收藏'){
					topic.favorite_url = $('#Main .topic_buttons a').first().attr('href');
				}else{
					topic.unFavorite_url = $('#Main .topic_buttons a').first().attr('href');
				}

				topic.twitter_url = $('#Main .topic_buttons a').eq(1).attr('onclick').match(/window.open\('(.+)', '_blank/i)[1];
				topic.weibo_url = $('#Main .topic_buttons a').eq(2).attr('onclick').match(/window.open\('(.+)', '_blank/i)[1];
				
				//console.log($('#Main .topic_buttons a').eq(3).html());
				if($('#Main .topic_buttons a').eq(3).html()){
					topic.ignore_url = $('#Main .topic_buttons a').eq(3).attr('onclick').match(/location.href = '(.+)'/i)[1];	
				}
				
				//https://www.v2ex.com/thank/topic/324495?t=qrrthxvtcebhkvabkjlxfgalpufakjyo post method
				if($('#topic_thank a').html()){
					let thank = $('#topic_thank a').eq(0).attr('onclick').match(/thankTopic\((\d+), '(.+)'\)/i);
					topic.thank_url = '/thank/topic/' + thank[1] + '?t=' + thank[2];
				}

				topic.reply_once = $('#Main .cell form input').first().attr('value');

			}

			if(page == 1){
				topic.replyList = [];
			}

			let newReplyList = [];
			$('#Main .box').children('.cell').each(function(i, el){
				let reply = {};
				reply.member_avatar = 'https:' + $(this).find('td[width="48"] img').first().attr('src');
				reply.member_name = $(this).find('td[width="auto"] strong a').first().text();
				reply.member_url = $(this).find('td[width="auto"] strong a').first().attr('href');
				reply.floor_number = $(this).find('td[width="auto"] .fr span').first().text();
				reply.content = $(this).find('.reply_content').html();
				if($(this).find('.thank_area a').html()){
					let ignore = $(this).find('.thank_area a').eq(0).attr('onclick').match(/ignoreReply\((\d+), '(.+)'\)/i);
					reply.ignore_url = '/ignore/reply/' + ignore[1] + '?once=' + ignore[2];

					let thank = $(this).find('.thank_area a').eq(1).attr('onclick').match(/thankReply\((\d+), '(.+)'\)/i);
					reply.thank_url = '/thank/reply/' + thank[1] + '?t=' + thank[2];
				}

				if(reply.content){
					newReplyList.push(reply);
				}
			});


			//add new replies
			if(page == 1){
				topic.replyList = topic.replyList.concat(newReplyList);
			}else{
				let currentCount = topic.replyList.length;
				let currentLastFloorNumber = parseInt(topic.replyList[currentCount-1].floor_number);
				let index = newReplyList.length-1;
				for( ; index>=0; index--){
					let reply = newReplyList[index];
					if(parseInt(reply.floor_number) == currentLastFloorNumber){
						break;
					}
				}

				let incrementReplyList = newReplyList.slice(index+1);
				topic.replyList = topic.replyList.concat(incrementReplyList);
			}

			//console.log('page', page, 'topic', topic);
			resolve(topic);
		})
		.catch( (error) => {
			reject(error);
		});
	});
}

export function fetchNewTopic(){
	let url = SITE.HOST + '/new';
	console.log('url', url);
	return new Promise( (resolve, reject) => {
		fetch(url)
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			let nodes = {};
			$('#nodes').children('option').each(function(i, elem){
				if($(this).text()){
					nodes[$(this).text()] = $(this).attr('value');
				}
			});
			let once = $('#compose input').eq(1).attr('value');

			resolve({
				nodes : nodes,
				once : once,
			});
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function postTopic(title, content, node, once){
	let postUrl = SITE.HOST + '/new';
	//console.log('postUrl', postUrl, title, content, node, once);
	return new Promise( (resolve, reject) => {
		let body = 'title=' + encodeURIComponent(title)+
				   '&content=' + encodeURIComponent(content)+ 
				   '&node_name=' + encodeURIComponent(node) + 
				   '&once=' + encodeURIComponent(once);
		fetch(postUrl,{
			method: 'post',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Content-Type':'application/x-www-form-urlencoded',
				'Content-Length': body.length,
				'Referer': postUrl,
			},
			credentials:'include',
			body: body,
		})
		.then( (response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(response.url.replace(SITE.HOST, ''));
			}else{
				resolve(false);
			}
		})
		.catch( (error)=>{
			reject(error);
		});
		//resolve('/t/326874#reply0');
	});	
}

export function getPostNewTopicOnce(){
	let getUrl = SITE.HOST + '/new';
	return new Promise( (resolve, reject) => {
		fetch(getUrl,{
			credentials : 'include',
		})
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			let once = $('#compose input').eq(1).attr('value');
			resolve(once);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});
}

export async function postNewTopic(title, content, node, once){
	let relocation = await postTopic(title, content, node, once);
	console.log('relocation', relocation);

	if( !relocation && relocation.indexOf('/new')){

		let newOnce = getPostNewTopicOnce();

		console.log('newOnce', newOnce);

		let newRelocation = await postTopic(title, content, node, newOnce);

		return newRelocation;

	}else{
		return relocation;
	}
	//return '/t/326988#reply0';
}

export function favoriteTopic(url){
	let favoriteUrl = SITE.HOST + url;

	return new Promise( (resolve, reject) => {
		fetch(favoriteUrl,{
			credentials:'include'
		})
		.then( (response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error)=>{
			reject(error);
		});	
	});
}

export function thankTopic(url){
	let thankUrl = SITE.HOST + url;
	console.log('thankUrl', thankUrl);
	return new Promise( (resolve, reject) => {
		fetch(thankUrl,{
			method: 'post',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Referer': thankUrl.split('?')[0],
			},
			credentials:'include'
		})
		.then( (response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error)=>{
			reject(error);
		});	
	});
}

export function replyTopic(url, once, content){
	let replyUrl = SITE.HOST + url;
	//console.log('replyUrl', replyUrl, once, content);
	return new Promise( (resolve, reject) => {
		let body = 'content=' + encodeURIComponent(content) + '&once=' + encodeURIComponent(once);
		fetch(replyUrl,{
			method: 'post',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Content-Type':'application/x-www-form-urlencoded',
				'Content-Length': body.length,
				'Referer': replyUrl,
			},
			credentials:'include',
			body: 'content=' + encodeURIComponent(content) + '&once=' + encodeURIComponent(once),
		})
		.then( (response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
			return response.text();
		})
		/*.then( (body)=>{
			console.log(body);
		})*/
		.catch( (error)=>{
			reject(error);
		});	
	});
}

export function thankReply(url){
	let thankUrl = SITE.HOST + url;
	//console.log('thankUrl', thankUrl);
	return new Promise( (resolve, reject) => {
		fetch(thankUrl,{
			method: 'post',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
			},
			credentials:'include'
		})
		.then( (response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error)=>{
			reject(error);
		});	
	});	
}

export function getLoginToken(name, password, url){
	return new Promise( (resolve, reject) => {
		fetch(url,{
			method : 'get',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Referer': "https://www.v2ex.com/",	
			}
		})
		.then( (response) => {
			return response.text();
		})
		.then( (body) => {
			//console.log('body',body);
			const $ = cheerio.load(body);
			loginField = {};
			loginField.name = $('.sl').first().attr('name');
			loginField.password = $('.sl').eq(1).attr('name');
			loginField.onceValue = $('input[name="once"]').first().attr('value');

			let postForm = {}
			postForm[loginField.name] = name;
			postForm[loginField.password] = password;
			postForm['once'] = loginField.onceValue;
			postForm['next'] = '/' 
			console.log('postForm', postForm);
			resolve(qs.stringify(postForm));

		})
		.catch( (error) => {
			console.error(error);
			reject(error);
		})
	});
}

export function loginWithToken(token, url){
	return new Promise( (resolve, reject) => {
		fetch(url, {
			method : 'post',
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Referer': "https://www.v2ex.com/signin",
				'Connection': 'keep-alive'
			},
			body: token,
			credentials: 'include'
		})
		.then( (response) => {
			return response.text();
		})
		.then( (body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			//let user = {};
			if( !$('.content td a[href="#;"]').first().attr('onclick') ){
				resolve(false);
			}else{

				/*user['logout_url'] = $('.content td a[href="#;"]').first().attr('onclick').match(/\/signout\?once=\d+/i)[0];
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
				user['gold_count'] = $('#Rightbar #money a').text().split(' ')[2];*/
				let user = API.parseUser($);
				let categoryNodeList = API.parseCategoryNode($);
				
				resolve({user, categoryNodeList});   
			}
		})
		.catch( (error) => {
			console.log('error', error);
			reject(error);
		});
	});
}

export async function login(name, password){
	let checkUser = await isLogin();
	console.log('checkUser:', checkUser)

	if( typeof checkUser === 'object'){
		//let logoutUrl = SITE.HOST + checkUser.logout_url
		let checkLogout = await tryLogout(checkUser.logout_url);
		console.log('checkLogout', checkLogout);
	}

	const url = SITE.HOST + '/signin';
	let token = await getLoginToken(name, password, url);
	console.log(token);

	let result = await loginWithToken(token, url);
	//console.log('result', result);

	return result;

}

export function isLogin(){
	const url = SITE.HOST + '/recent';
	return new Promise( (resolve, reject) => {
		fetch(url,{
			method : 'get',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Referer': "https://www.v2ex.com/",	
			}
		})
		.then( (response) => {
			return response.text();
		})
		.then( (body) => {
			//console.log('body',body);
			const $ = cheerio.load(body);

			//console.log($('title').text().indexOf("最近"));
			if( $('title').text().indexOf("最近")>= 0 ){

				let user = {}
				user['logout_url'] = $('#Top .content td a[href="#;"]').first().attr('onclick').match(/\/signout\?once=\d+/i)[0];
				user['name'] = $('#Top .content td a').eq(2).text();
				user['member_url'] = $('#Top .content td a').eq(2).attr('href');
				user['avatar_url'] = 'https:' + $('#Rightbar .box .cell table tr td img[class="avatar"]').attr('src');
				
				user['words'] = $('#Rightbar .box').first().find('.cell').first().find('table').first().find('tr td .fade').first().text();
				
				user['favorite_node_count'] = $('#Rightbar .box td[width="33%"] .bigger').eq(0).text();
				user['favorite_topic_count'] = $('#Rightbar .box td[width="34%"] .bigger').eq(0).text();
				user['focus_user_count'] = $('#Rightbar .box td[width="33%"] .bigger').eq(1).text();
				
				user['notification_count'] = $('#Rightbar a[href="/notifications"]').first().text().replace(' 条未读提醒', '');
				//console.log($('#Rightbar #money a').text().split(' '));
				user['silver_count'] = $('#Rightbar #money a').text().split(' ')[0];
				user['gold_count'] = $('#Rightbar #money a').text().split(' ')[2];

				resolve(user);
			}else{
				resolve(false);
			}
		})
		.catch( (error) => {
			console.log('error', error);
			reject(error);
		})		
	});
}

export function tryLogout(path){
	let logout_url = SITE.HOST + path;
	console.log('logout_url', logout_url);
	return new Promise( (resolve, reject) => {
		fetch(logout_url, {
			method : 'get',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Referer': "https://www.v2ex.com/",
				'Connection': 'keep-alive',		
			},
			credentials: 'include'
		})
		.then( (response) => {
			return response.text();
		})
		.then( (body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			if($('input[value="Retry Sign Out"]').length >= 1){
				resolve(false)
			}else{
				resolve(true);
			}
		})
		.catch( (error) => {
			console.log('error', error);
			reject(error);
		});
	});
}

export async function logout(path){
	let result = await isLogin();
	if(!result){
		return true;
	}else{
		result = await tryLogout(result.logout_url);
	}

	return result;
}

export function fetchMyMeta(user){
	//
	let myMetaUrl = SITE.HOST + '/settings';

	return new Promise( (resolve, reject) => {
		fetch(myMetaUrl, {
			credentials:'include'
		})
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			const $ = cheerio.load(body);
			let newUser = API.parseUser($);
			resolve(Object.assign({}, user, newUser));
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	})
}

export function fetchMyTopic(path, page=1){
	let myTopicUrl = SITE.HOST + path + '/topics?p=' + page;
	//console.log('myTopicUrl:', myTopicUrl);
	return new Promise( (resolve, reject) => {

		fetch(myTopicUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let topicList = []
			const $ = cheerio.load(body);
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
			//console.log('topics length:', topics.length);
			let total_count = $('#Main .header .fr .gray').first().text();

			const result = {
				topicList : topicList,
				total_count : total_count,
			}
			resolve(result);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function fetchMyReply(path, page=1){
	//path = '/member/jianghu521';
	//page = 3;
	let myTopicUrl = SITE.HOST + path + '/replies?p=' + page;
	//console.log('myTopicUrl:', myTopicUrl);
	return new Promise( (resolve, reject) => {

		fetch(myTopicUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let replyList = [];
			const $ = cheerio.load(body);
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

			let total_count = $('#Main .header .fr .gray').first().text();
			const result = {
				replyList : replyList,
				total_count : total_count,
			}
			resolve(result);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function fetchMyNode(){
	let nodeUrl = SITE.HOST + '/my/nodes';
	return new Promise( (resolve, reject) => {
		fetch(nodeUrl, {
			credentials:'include'
		})
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let nodeList = [];
			let $ = cheerio.load(body);
			$('#MyNodes').children('a').each(function(i, el){
				node = {};
				node.path = $(this).attr('href');
				node.img_url = 'https:' + $(this).find('img').first().attr('src');
				node.name = $(this).find('div').first().text().split(' ')[0];
				node.topic_count = $(this).find('div').first().text().split(' ')[1];
				nodeList.push(node);
			})

			resolve(nodeList);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function fetchMyFavoriteTopic(path, page=1){
	//let myFavoriteTopicUrl = SITE.HOST + '/my' + '/topics?p=' + page;
	let myFavoriteTopicUrl = SITE.HOST + path + '?p=' + page;
	console.log('myFavoriteTopicUrl:', myFavoriteTopicUrl);
	return new Promise( (resolve, reject) => {

		fetch(myFavoriteTopicUrl, {
			credentials:'include'
		})
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let topicList = []
			const $ = cheerio.load(body);
			$('.box').children('.item').each(function(i, el){
				topic = {}
				topic.member_url = $(this).find('.small strong a').first().attr('href');
				topic.member_name = $(this).find('.small strong a').first().text();
				topic.member_avatar = 'https:' + $(this).find('td[width="48"] img').first().attr('src');
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
			let total_count = $('#Main .header .fr .gray').first().text();

			const result = {
				topicList : topicList,
				totalCount : total_count,
			}
			resolve(result);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function fetchMyNotification(page = 1){
	let myNotificationUrl = SITE.HOST + '/notifications' + '?p=' + page;
	console.log('myNotificationUrl:', myNotificationUrl);
	return new Promise( (resolve, reject) => {

		fetch(myNotificationUrl, {
			credentials:'include'
		})
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let notificationList = []
			const $ = cheerio.load(body);
			$('#Main .box').children('.cell').each(function(i, el){
				notification = {}
				notification.member_url = $(this).find('td[width="32"] a').first().attr('href');
				//console.log(i, notification.member_url)
				if(notification.member_url){
					notification.member_avatar = 'https:' + $(this).find('td[width="32"] img').first().attr('src');
					notification.member_name = $(this).find('.fade a strong').first().text();
					notification.operation = $(this).find('.fade').first().text();

					notification.topic_title = $(this).find('.fade a').eq(1).text();
					notification.topic_url = $(this).find('.fade a').eq(1).attr('href');

					notification.post_date = $(this).find('.snow').first().text();
					notification.content = $(this).find('.payload').first().html();
	
					let deleteOperation = $(this).find('.node').first().attr('onclick').match(/deleteNotification\((\d+), (\d+)\)/i);

					notification.delete_url = '/delete/notification/' + deleteOperation[1] + '?once=' + deleteOperation[2];	
					notificationList.push(notification);
				}

			});
			let total_count = $('#Main .header .fr .gray').first().text();

			const result = {
				notificationList : notificationList,
				totalCount : total_count,
			}
			resolve(result);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});		
}

export function deleteNotification(path){
	let delete_url = SITE.HOST + path;
	return new Promise( (resolve, reject) => {
		fetch(delete_url, {
			method : 'post',
			headers : {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
				'Referer': "https://www.v2ex.com/notifications",
			},
			credentials: 'include'
		})
		.then( (response) => {
			console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error) => {
			console.log('error', error);
			reject(error);
		});
	});
}

export function fetchUser(path){
	const url = SITE.HOST + path;
	console.log('url', url);
	return new Promise( (resolve, reject) => {
		fetch(url)
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			user = {};
			user.member_avatar = $('#Main .box').eq(0).children('.cell').first().find('img').first().attr('src');
			user.member_avatar = user.member_avatar ? 'https:' + user.member_avatar : undefined;
			user.member_name = $('#Main .box .cell h1').first().text();
			user.member_url = path;
			user.member_intro = $('#Main .box').eq(0).children('.cell').first().find('.bigger').text();

			user.member_department = $('#Main .box').eq(0).children('.cell').first().find('span').eq(1).text();
			user.member_num = $('#Main .box').eq(0).children('.cell').first().find('.gray').text().split('，')[0];
			user.member_date = $('#Main .box').eq(0).children('.cell').first().find('.gray').text().split('，')[1];

			user.silver_count = $('#Main .box .cell .balance_area').text().split(' ')[0];
			user.gold_count = $('#Main .box .cell .balance_area').text().split(' ')[2];
			
			user.active_num = $('#Main .box').eq(0).children('.cell').first().find('a').text();
			user.active_url = $('#Main .box').eq(0).children('.cell').first().find('a').attr('href');

			let focus = $('#Main .box').eq(0).children('.cell').first().find('input').first().attr('onclick').match(/location.href = \'(.+)\'/i);
			//console.log('focus', focus);
			user.focus_url = focus[1]
			//user.focus_url = focus[1]; 
			let block = $('#Main .box').eq(0).children('.cell').first().find('input').eq(1).attr('onclick').match(/location.href = \'(.+)\'/i);
			//console.log('block', block);
			user.block_url = block[1];

			user.linkList = [];
			$('#Main .box').eq(0).children('.markdown_body').find('a').each(function(){
				let link = {};
				link.url = $(this).attr('href');
				link.img = SITE.HOST + $(this).find('img').first().attr('src');
				link.name = $(this).text();
				user.linkList.push(link);
			});
			user.words = $('#Main .box').eq(0).children('.cell').eq(2).html();
			resolve(user);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});
}

export function fetchUserTopicList(path, page=1){
	let myTopicUrl = SITE.HOST + path + '/topics?p=' + page;
	//console.log('myTopicUrl:', myTopicUrl);
	return new Promise( (resolve, reject) => {

		fetch(myTopicUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let topicList = []
			const $ = cheerio.load(body);
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
			//console.log('topics length:', topics.length);
			let total_count = $('#Main .header .fr .gray').first().text();

			const result = {
				topicList : topicList,
				total_count : total_count,
			}
			resolve(result);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function fetchUserReplyList(path, page=1){
	//path = '/member/jianghu521';
	//page = 3;
	let myTopicUrl = SITE.HOST + path + '/replies?p=' + page;
	//console.log('myTopicUrl:', myTopicUrl);
	return new Promise( (resolve, reject) => {

		fetch(myTopicUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			let replyList = [];
			const $ = cheerio.load(body);
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

			let total_count = $('#Main .header .fr .gray').first().text();
			const result = {
				replyList : replyList,
				total_count : total_count,
			}
			resolve(result);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function requestFocusUser(path){
	let focusUserUrl = SITE.HOST + path;
	//console.log('focusUserUrl', focusUserUrl)
	return new Promise( (resolve, reject) => {
		fetch(focusUserUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});	
}

export function requestBlockUser(path){
	let blockUserUrl = SITE.HOST + path;
	console.log('blockUserUrl', blockUserUrl)
	return new Promise( (resolve, reject) => {
		fetch(blockUserUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response);
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});		
}

export function fetchCategoryNode(){
	let url = SITE.HOST;
	//console.log('url', url);
	return new Promise( (resolve, reject) => {
		fetch(url)
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			/*let categoryNodeList = [];
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
			});*/
			let categoryNodeList = API.parseCategoryNode($);
			//console.log('categoryNodeList', categoryNodeList);
			resolve(categoryNodeList);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});
}

export function fetchAllNode(){
	let url = SITE.HOST + '/planes';
	//console.log('url', url);
	return new Promise( (resolve, reject) => {
		fetch(url)
		.then((response) => {
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			let allNodes = [];
			$('#Main .box .inner').children('.item_node').each(function(){
				node = {};
				node.name = $(this).text();
				node.path = $(this).attr('href');
				allNodes.push(node);
			})

			//console.log('allNodes:', allNodes);
			resolve(allNodes);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});
}

export async function fetchNode(){
	let [categoryNodeList, allNode] = await Promise.all([fetchCategoryNode(), fetchAllNode()]);
	//const categoryNodeList = await fetchCategoryNode();
	//const allNode = await fetchAllNode();
	return {
		categoryNodeList : categoryNodeList,
		allNode : allNode,
	}
}

export function fetchNodePage(currentNode, page=1){
	//console.log('currentNode', currentNode);
	let url = SITE.HOST + currentNode.path + '?p=' + page;
	return new Promise( (resolve, reject) => {
		fetch(url)
		.then( (response) => {
			return response.text();
		})
		.then( (body) => {

			const $ = cheerio.load(body);

			if(page == 1){

				currentNode.words = $('#Main .header span[class="f12 gray"]').text();
				currentNode.topic_count = $('.gray', '#Main .header .f12').text();
				currentNode.favorite_url = $('a', '#Main .header .f12').attr('href');
				currentNode.new_topic_url = $('#Main .header input').attr('onclick').match(/location.href = '(.+)'/i)[1];
				currentNode.avatar_url = 'https:' + $('#Main .header img').attr('src')
				

				//console.log('prev',$('#Rightbar').find('.box').last().prev().html())
				//console.log('eq',$('#Rightbar').find('.box').eq(-2).html())
				let parentNode = {};
				parentNode.avatar_url = 'https:' + $('#Rightbar').find('.box').eq(-2).find('.cell').eq(0).find('img').first().attr('src');
				parentNode.name = $('#Rightbar').find('.box').eq(-2).find('.cell').eq(0).find('a').first().text();
				parentNode.path = $('#Rightbar').find('.box').eq(-2).find('.cell').eq(0).find('a').first().attr('href');
				currentNode.parentNode = parentNode;

				let related_nodeList = [];
				let child_nodeList = [];

				//console.log('second cell', $('#Rightbar').find('.box').eq(2).find('.cell').eq(1).html());
				if( $('#Rightbar').find('.box').eq(-2).find('.cell').eq(1).html() ){
					
					$('#Rightbar').find('.box').eq(-2).find('.cell').eq(1).find('img').each(function(){
						let related_node = {};
						related_node.avatar_url = 'https:' + $(this).attr('src');
						related_node.name = $(this).next().text();
						related_node.path = $(this).next().attr('href');
						related_nodeList.push(related_node);
					});

					$('#Rightbar').find('.box').eq(-2).find('.inner img').each(function(){
						let child_node = {};
						child_node.avatar_url = 'https:' + $(this).attr('src');
						child_node.name = $(this).next().text();
						child_node.path = $(this).next().attr('href');
						child_nodeList.push(child_node);
					});

				}else{

					$('#Rightbar').find('.box').eq(-2).find('.inner img').each(function(){
						let related_node = {};
						related_node.avatar_url = 'https:' + $(this).attr('src');
						related_node.name = $(this).next().text();
						related_node.path = $(this).next().attr('href');
						related_nodeList.push(related_node);
					});
				}
				currentNode.related_nodeList = related_nodeList;
				currentNode.child_nodeList = child_nodeList;
			}

			let newTopicList = API.parseNodeTopicList($, currentNode);
			if( page == 1 ){
				currentNode.topicList = [];
				currentNode.topicList = currentNode.topicList.concat(newTopicList);
			}else{

				let firstNewTopic = newTopicList[0];
				let foundIndex = currentNode.topicList.findIndex( (topic, index, arr)=> {
					return topic.topic_url.split('#')[0] == firstNewTopic.topic_url.split('#')[0];
				});

				if(foundIndex >= 0){
					newTopicList.splice(0, currentNode.topicList.length-foundIndex);
				}

				currentNode.topicList = currentNode.topicList.concat(newTopicList);
			}


			resolve(currentNode);
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});
}

export function requestFavoriteNode(node){
	let favoriteNodeUrl = SITE.HOST + node.favorite_url;
	//console.log('favoriteNodeUrl', favoriteNodeUrl)
	return new Promise( (resolve, reject) => {
		fetch(favoriteNodeUrl, {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response);
			//console.log(response.text());
			if(response.status === 200 && response.ok){
				resolve(true);
			}else{
				resolve(false);
			}
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});		
}

export function fetchGoogleSearch(searchText, nextPageUrl){
	console.log('searchText', searchText, nextPageUrl);
	let searchUrl;
	if(nextPageUrl){
		searchUrl = nextPageUrl
	}else{
		searchUrl = 'https://www.google.com/search?q=site:v2ex.com/t%20' + searchText;
	}
	console.log('searchUrl:', searchUrl);
	return new Promise( (resolve, reject) => {

		fetch(searchUrl)
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			console.log('body', body);
			const $ = cheerio.load(body);
			let topicList = [];
			$('.g').each(function(i, el){
				let topic = {}
				topic.topic_title = $(this).find('h3 a').text();
				topic.topic_url = $(this).find('.kv cite').text().replace(SITE.HOST, '');
				topic.brief_content = $(this).find('.st').html();
				topicList.push(topic);
			});

			let nextPageUrl = 'https://www.google.com' + $('#foot .fl').attr('href');
			resolve({
				topicList : topicList,
				nextPageUrl :  nextPageUrl,
			});
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})

	});	
}

export function FetchBingSearch(searchText, nextPageUrl){
	console.log('searchText', searchText, nextPageUrl);
	let searchUrl;
	if(nextPageUrl){
		searchUrl = 'http://cn.bing.com' + nextPageUrl
	}else{
		searchUrl = 'http://cn.bing.com/search?q=site:v2ex.com/t%20' + searchText
		//searchUrl = 'https://www.google.com/search?q=site:v2ex.com/t%20' + searchText;
	}
	console.log('searchUrl:', searchUrl);
	return new Promise( (resolve, reject) => {

		fetch(searchUrl)
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			let topicList = [];
			$('.b_algo').each(function(i, el){
				let topic = {}
				topic.topic_title = $(this).find('h2 a').html();
				topic.topic_url = $(this).find('h2 a').attr('href').replace(SITE.HOST, '');
				topic.brief_content = $(this).find('.b_caption p').html();
				topic.takein_search_date = $(this).find('.b_attribution').text().replace(SITE.HOST,'').replace(topic.topic_url, '');
				topicList.push(topic);
			});

			let nextPageUrl = $('.b_pag .sb_pagN').attr('href');
			resolve({
				topicList : topicList,
				nextPageUrl :  nextPageUrl,
			});
		})
		.catch( (error) => {
			console.log(error);
			reject(error);
		})
	});		
}




