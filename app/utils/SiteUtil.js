import cheerio from 'cheerio-without-node-native'
import qs from 'qs'

import SITE from '../constants/Config'

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
			topic.topic_title = $('#Main .box .header h1').first().text();
			topic.topic_content = $('#Main .topic_content .markdown_body').html();
			if(!topic.topic_content){
				topic.topic_content = $('#Main .topic_content').html();
			}
			topic.vote_count = $('#topic_' + topicId + '_votes').find('a').first().text();
			topic.click_count = $('#Main .box .header .gray').first().text().split('·')[2];
			topic.post_date = $('#Main .box .header .gray').first().text().split('·')[1];
			topic.collect_count =$('#Main .topic_buttons .fr').first().text().split('∙')[1];
			topic.reply_count = $('#Main .box .cell .gray').first().text().split('回复')[0].replace(' ', '');

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
			let user = {};
			if( !$('.content td a[href="#;"]').first().attr('onclick') ){
				resolve(false);
			}else{
				user['logout_url'] = $('.content td a[href="#;"]').first().attr('onclick').match(/\/signout\?once=\d+/i)[0];
				user['name'] = $('.content td a').eq(2).text();
				user['member_url'] = $('.content td a').eq(2).attr('href');
				user['avatar_url'] = 'https:' + $('#Rightbar .box .cell table tr td img[class="avatar"]').attr('src');
				resolve(user);   
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
		let logoutUrl = SITE.HOST + checkUser.logout_url
		let checkLogout = await logout(logoutUrl);
		console.log('checkLogout', checkLogout);
	}

	const url = SITE.HOST + '/signin';
	let token = await getLoginToken(name, password, url);
	console.log(token);

	let user = await loginWithToken(token, url);
	console.log('user', user);

	return user;

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

export function logout(url){
	return new Promise( (resolve, reject) => {
		fetch(url, {
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
			user.member_avatar = $('#Main .box').eq(1).children().first().find('img').first().attr('src');
			user.member_name = $('#Main .box .cell h1').first().text();
			user.member_url = path;
			//user.member_intro = $('#Main .box').eq(1).children().first().find('.bigger').text();
			user.member_num = $('#Main .box .cell table tbody tr td').eq(3)
			user.member_date = $('#Main .box .cell .gray').eq(1).first().text().split('，')[1];
			/*user.active_num = $('#Main .box .cell').eq(1).find('.gray a').first().text();
			user.active_url = $('#Main .box .cell').eq(1).find('.gray a').first().attr('href');
			user.linkList = [];
			$('#Main .box .markdown_body').first().children('a').each(function(){
				let link = {};
				link.url = $(this).attr('href');
				link.img = SITE.HOST + $(this).find('img').src('src');
				link.name = $(this).text();
				user.linkList.push(link);
			});
			user.words = $('#Main .box .cell').eq(3).text();*/
			resolve(user);
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




