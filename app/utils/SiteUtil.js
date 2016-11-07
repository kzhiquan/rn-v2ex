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

const post_headers = {
        'authority': "www.v2ex.com",
        'method': "POST",
        'path': '/signin',
        'scheme': 'https',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': "http://www.zhihu.com/",
        'content-type': "application/x-www-form-urlencoded",
        'origin': 'https://www.v2ex.com',
        'referer': 'https://www.v2ex.com/signin',
        'User-Agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    }

export function getLoginWillPostForm(name, password){
	return new Promise((resolve, reject) => {
		url = SITE.HOST + '/signin'
		fetch(url, {
			credentials: 'include'
		})
		.then((response) => {
			console.log(response.headers);
			return response.text();
		})
		.then((body) => {

			const $ = cheerio.load(body);
			loginField = {};
			loginField.name = $('.sl').first().attr('name');
			loginField.password = $('.sl').eq(1).attr('name');
			loginField.once = $('input[name="once"]').first().attr('value');
			//console.log(loginField);

			let postForm = {}
			postForm[loginField.name] = name;
			postForm[loginField.password] = password;
			postForm['once'] = loginField.once;
			postForm['next'] = '/' 

			//console.log(qs.stringify(postForm));

			resolve(postForm);

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