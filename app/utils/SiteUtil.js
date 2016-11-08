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


export function getLoginWillPostForm(name, password){
	return new Promise((resolve, reject) => {
		url = SITE.HOST + '/signin';
		var cookie;
		fetch(url,{
			method : 'get',
			headers : {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
					'Referer': "https://www.v2ex.com/",
					'Connection': 'keep-alive',
					//'Cookie' : '__utma=1.343345715.1476169831.1477646100.1477646100.1; __utmc=1; __utmz=1.1477646100.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
			},
			credentials: 'include'
		})
		.then((response) => {
			//console.log(response);
			//headers = response.headers;
			var pb3_session = response.headers.get('set-cookie').split(';')[0];
			var v2ex_lang = 'V2EX_LANG=zhcn'

			//cookie = response.headers.get('set-cookie').split(';')[0];
			cookie = pb3_session + '; ' + v2ex_lang
			//cookie = response.headers.get('set-cookie');
			//console.log('cookie', cookie);
			return response.text();
		})
		.then((body) => {
			//console.log('body', body);
			const $ = cheerio.load(body);
			loginField = {};
			loginField.name = $('.sl').first().attr('name');
			loginField.password = $('.sl').eq(1).attr('name');
			loginField.once = $('input[name="once"]').first().attr('value');
			console.log(loginField);

			let postForm = {}
			postForm[loginField.name] = name;
			postForm[loginField.password] = password;
			postForm['once'] = loginField.once;
			postForm['next'] = '/' 

			//console.log(qs.stringify(postForm));

			resolve({postForm, cookie});

			/*fetch(url, {
				method : 'POST',
				header : post_headers,
				body: qs.stringify(postForm)
			})
			.then((response_post) => {
				console.log(response_post);
				return response_post.text();
			})
			.then((body_post) => {
				console.log('body', body_post);
			})
			.catch((error) => {
				console.error('error', error);
			})*/

		})
		.catch((error) => {
			console.error('error', error);
			reject(error);
		})
	});
}

export function getLoginToken(name, password, url){
	return new Promise( (resolve, reject) => {
		fetch(url,{
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
			resolve(body);
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
			console.log(response.headers);
			return response.text();
		})
		.then((body) => {
			console.log('body', body);
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

	var body = await loginWithToken(token, url);
	console.log(body);

	//var bodyRecent = await fetchRecentTopic();

	//console.log('body', bodyRecent);
};
