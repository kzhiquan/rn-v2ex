import cheerio from 'cheerio-without-node-native'
import qs from 'qs'

import SITE from '../constants/Config'

export function fetchTopicList(path){
  return new Promise((resolve, reject) => {
  	url = SITE.HOST + path;
  	//console.log('url', url);
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((body) => {
		topics = []
		const $ = cheerio.load(body);
		$('.box').children('.item').each(function(i, el){
			//console.log(i);
			topic = {}
			topic.member_url = $(this).find('td[width="48"] a').first().attr('href');
			topic.member_name = $(this).find('.small strong a').first().text();
			topic.member_avatar = 'https:' + $(this).find('td[width="48"] img').first().attr('src');
			topic.topic_url = $(this).find('.item_title a').first().attr('href');
			topic.topic_title = $(this).find('.item_title a').first().text();
			topic.node_url = $(this).find('.node').first().attr('href');
			topic.node_name = $(this).find('.node').first().text();
			topic.date = $(this).find('.small').text().split('•')[2];
			topic.latest_reply_member_name = $(this).find('.small strong a').eq(1).text();
			topic.latest_reply_menber_url = $(this).find('.small strong a').eq(1).attr('href');
			topic.reply_count = $(this).find('td[width="70"] a').first().text();
			topic.reply_url = $(this).find('td[width="70"] a').first().attr('href');
			topics.push(topic);
		});
		//console.log('topics length:', topics.length);
		resolve(topics);
      })
      .catch((error) => {
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
			if($('.content td a').length < 7 ){
				resolve(false);
			}else{
				user['logout_url'] = $('.content td a').eq(7).attr('onclick').match(/\/signout\?once=\d+/i)[0];
				user['name'] = $('.content td a').eq(2).text();
				user['member_url'] = $('.content td a').eq(2).attr('href');
				resolve(user);
			}
		})
		.catch( (error) => {
			console.error(error);
			reject(error);
		});
	});
}


export function fetchRecentTopic(){
	return new Promise( (resolve, reject) => {

		fetch('https://www.v2ex.com/recent?p=2', {
			credentials:'include'
		})
		.then((response) => {
			//console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			resolve(body);
		})
		.catch( (error) => {
			console.error(error);
			reject(error);
		})
	});

}

export async function login(name, password){
	const url = SITE.HOST + '/signin';
	var token = await getLoginToken(name, password, url);
	console.log(token);

	console.log('url:', url);
	var user = await loginWithToken(token, url);
	console.log('user', user);
	if(!user){
		login(name, password);
	}


	var result = await logout(SITE.HOST + user.logout_url);
	console.log('result', result);
	if ( typeof result === 'boolean' && !result ){
		var result_again = await logout(SITE.HOST + user.logout_url);
		console.log('result_again', result_again);
	}

	if ( typeof result === 'boolean' && result){
		var body = await fetchRecentTopic();
		console.log('body', body);
	}
};

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
			console.log('body', body);
			const $ = cheerio.load(body);
			if($('input[value="Retry Sign Out"]').length >= 1){
				resolve(false)
			}else{
				resolve(true);
			}
		})
		.catch( (error) => {
			console.error(error);
			reject(error);
		});
	});
}
