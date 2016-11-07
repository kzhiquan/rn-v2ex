# api document for https://www.v2ex.com/

## Statistic.

### Get current count topics and users.

/api/site/stats.json

{
	"topic_max": 304597,
	"member_max": 193376
}

curl https://www.v2ex.com/api/site/stats.json

### Get basic site information

/api/site/info.json

{
	"title": "V2EX",
	"slogan": "way to explore",
	"description": "创意工作者们的社区",
	"domain": "www.v2ex.com"
}

curl https://www.v2ex.com/api/site/info.json

## Topic

### Get the latest 20 articles

/api/topics/latest.json

[
    
    {
        "id" : 316315,
        "title" : "",
        "url" : "http://www.v2ex.com/t/316315",
        "content" : "",
        "content_rendered", "",
        "replies" : 0,
        "member" : {
            "id" : 198692,
            "username" : "zzzz1234",
            "tagline" : "",
            "avatar_mini" : "//cdn.v2ex.co/gravatar/78535b9a6c0eed143cbfaee614d6d841?s=24&d=retro",
            "avatar_normal" : "//cdn.v2ex.co/gravatar/78535b9a6c0eed143cbfaee614d6d841?s=48&d=retro",
            "avatar_large" : "//cdn.v2ex.co/gravatar/78535b9a6c0eed143cbfaee614d6d841?s=73&d=retro"
        },
        "node" : {
            "id" : 12,
            "name" : "qna",
            "title" : "问与答",
            "title_alternative" : "Questions and Answers",
            "url" : "http://www.v2ex.com/go/qna",
            "topics" : 77906,
            "avatar_mini" : "//cdn.v2ex.co/navatar/c20a/d4d7/12_mini.png?m=1477462211",
            "avatar_normal" : "//cdn.v2ex.co/navatar/c20a/d4d7/12_normal.png?m=1477462211",
            "avatar_large" : "//cdn.v2ex.co/navatar/c20a/d4d7/12_large.png?m=1477462211"
        },
        "created" : 1477663774,
        "last_modified" : 1477663774,
        "last_touched" : 1477577374
    },
    ...
]

curl https://www.v2ex.com/api/topics/latest.json

### Get the hotest 10 articles

/api/topics/hot.json

[
	{
        "id" : 315988,
        "title" : "你们怎么用中文描述 coding？",
        "url" : "http://www.v2ex.com/t/315988",
        "content" : "纯属好奇，下面是经常听到的几种说法，欢迎补充。\u000D\u000Aa 敲代码\u000D\u000Ab 码代码\u000D\u000Ac 打代码\u000D\u000A我是 a",
        "content_rendered" : "纯属好奇，下面是经常听到的几种说法，欢迎补充。\u000D\u003Cbr /\u003Ea 敲代码\u000D\u003Cbr /\u003Eb 码代码\u000D\u003Cbr /\u003Ec 打代码\u000D\u003Cbr /\u003E我是 a",
        "replies" : 65,
        "member" : {
            "id" : 184696,
            "username" : "CFO",
            "tagline" : "",
            "avatar_mini" : "//cdn.v2ex.co/gravatar/ae18ee447ec3c0a7b061f32ae9010d8a?s=24&d=retro",
            "avatar_normal" : "//cdn.v2ex.co/gravatar/ae18ee447ec3c0a7b061f32ae9010d8a?s=48&d=retro",
            "avatar_large" : "//cdn.v2ex.co/gravatar/ae18ee447ec3c0a7b061f32ae9010d8a?s=73&d=retro"
        },
        "node" : {
            "id" : 300,
            "name" : "programmer",
            "title" : "程序员",
            "title_alternative" : "Programmer",
            "url" : "http://www.v2ex.com/go/programmer",
            "topics" : 13669,
            "avatar_mini" : "//cdn.v2ex.co/navatar/94f6/d7e0/300_mini.png?m=1477535591",
            "avatar_normal" : "//cdn.v2ex.co/navatar/94f6/d7e0/300_normal.png?m=1477535591",
            "avatar_large" : "//cdn.v2ex.co/navatar/94f6/d7e0/300_large.png?m=1477535591"
        },
        "created" : 1477579465,
        "last_modified" : 1477579465,
        "last_touched" : 1477661318
    }
    ...
]

curl https://www.v2ex.com/api/topics/hot.json

### Get the topic by id

/api/topics/show.json?id=1

[{
    
    "id" : 315988,
    "title" : "你们怎么用中文描述 coding？",
    "url" : "http://www.v2ex.com/t/315988",
    "content" : "纯属好奇，下面是经常听到的几种说法，欢迎补充。\u000D\u000Aa 敲代码\u000D\u000Ab 码代码\u000D\u000Ac 打代码\u000D\u000A我是 a",
    "content_rendered" : "纯属好奇，下面是经常听到的几种说法，欢迎补充。\u000D\u003Cbr /\u003Ea 敲代码\u000D\u003Cbr /\u003Eb 码代码\u000D\u003Cbr /\u003Ec 打代码\u000D\u003Cbr /\u003E我是 a",
    "replies" : 65,
    "member" : {
        "id" : 184696,
        "username" : "CFO",
        "tagline" : "",
        "avatar_mini" : "//cdn.v2ex.co/gravatar/ae18ee447ec3c0a7b061f32ae9010d8a?s=24&d=retro",
        "avatar_normal" : "//cdn.v2ex.co/gravatar/ae18ee447ec3c0a7b061f32ae9010d8a?s=48&d=retro",
        "avatar_large" : "//cdn.v2ex.co/gravatar/ae18ee447ec3c0a7b061f32ae9010d8a?s=73&d=retro"
    },
    "node" : {
        "id" : 300,
        "name" : "programmer",
        "title" : "程序员",
        "url" : "http://www.v2ex.com/go/programmer",
        "topics" : 13669,
        "avatar_mini" : "//cdn.v2ex.co/navatar/94f6/d7e0/300_mini.png?m=1477535591",
        "avatar_normal" : "//cdn.v2ex.co/navatar/94f6/d7e0/300_normal.png?m=1477535591",
        "avatar_large" : "//cdn.v2ex.co/navatar/94f6/d7e0/300_large.png?m=1477535591"
    },
    "created" : 1477579465,
    "last_modified" : 1477579465,
    "last_touched" : 1477661318
    
}]

curl https://www.v2ex.com/api/topics/show.json?id=1

### Get the topics of the node/user

/api/topics/show.json?id=1
/api/topics/show.json?node_id=1
/api/topics/show.json?node_name=v2ex
/api/topics/show.json?username=zhiquan

[
    
    {
        "id" : 313046,
        "title" : "pb 的通知系统在那里？",
        "url" : "http://www.v2ex.com/t/313046",
        "content" : "小白一个，pb源码太多毫无头绪，老虎咬天无从下口，想学习一下 pb 的通知系统怎么做的，就是 @一下就会有通知这种的。谢谢大神！",
        "content_rendered" : "小白一个，pb源码太多毫无头绪，老虎咬天无从下口，想学习一下 pb 的通知系统怎么做的，就是 @一下就会有通知这种的。谢谢大神！",
        "replies" : 0,
        "member" : {
            "id" : 190840,
            "username" : "makeitall",
            "tagline" : "None",
            "avatar_mini" : "//cdn.v2ex.co/avatar/3a52/4241/190840_mini.png?m=1475667571",
            "avatar_normal" : "//cdn.v2ex.co/avatar/3a52/4241/190840_normal.png?m=1475667571",
            "avatar_large" : "//cdn.v2ex.co/avatar/3a52/4241/190840_large.png?m=1475667571"
        },
        "node" : {
            "id" : 1,
            "name" : "babel",
            "title" : "Project Babel",
            "title_alternative" : "Project Babel",
            "url" : "http://www.v2ex.com/go/babel",
            "topics" : 1119,
            "avatar_mini" : "//cdn.v2ex.co/navatar/c4ca/4238/1_mini.png?m=1419840368",
            "avatar_normal" : "//cdn.v2ex.co/navatar/c4ca/4238/1_normal.png?m=1419840368",
            "avatar_large" : "//cdn.v2ex.co/navatar/c4ca/4238/1_large.png?m=1419840368"
        },
        "created" : 1476537973,
        "last_modified" : 1476538041,
        "last_touched" : 1476537793
    },
    ....
]

curl https://www.v2ex.com/api/topics/show.json?id=1
curl https://www.v2ex.com/api/topics/show.json?node_id=1
curl https://www.v2ex.com/api/topics/show.json?node_name=v2ex
curl https://www.v2ex.com/api/topics/show.json?username=Livid

### Create an topic

/api/topics/create.json

parameters unclear here.

## Node

### Get all Nodes information

/api/nodes/all.json

[
    {
        "id" : 2,
        "name" : "v2ex",
        "url" : "http://www.v2ex.com/go/v2ex",
        "title" : "V2EX",
        "title_alternative" : "V2EX",
        "topics" : 2710,
        "header" : "这里讨论和发布关于 V2EX 站点的发展。",
        "footer" : null,
        "created" : 1272207021
    },
    ...
]

curl https://www.v2ex.com/api/nodes/all.json

### Get information of the node

/api/nodes/show.json?name=YourNodeName
/api/nodes/show.json?id=YourNodeId

{
    "id" : 2,
    "name" : "v2ex",
    "url" : "http://www.v2ex.com/go/v2ex",
    "title" : "V2EX",
    "title_alternative" : "V2EX",
    "topics" : 2710,
    "stars" : 620,
    "header" : "这里讨论和发布关于 V2EX 站点的发展。",
    "footer" : null,
    "created" : 1272207021,
    "avatar_mini" : "//cdn.v2ex.co/navatar/c81e/728d/2_mini.png?m=1452035333",
    "avatar_normal" : "//cdn.v2ex.co/navatar/c81e/728d/2_normal.png?m=1452035333",
    "avatar_large" : "//cdn.v2ex.co/navatar/c81e/728d/2_large.png?m=1452035333"
}

curl https://www.v2ex.com/api/nodes/show.json?id=2

## Reply

### Get replies of the topic

/api/replies/show.json?topic_id=1
/api/replies/show.json?topic_id=1&page=?


[
    {
        "id" : 2184629,
        "thanks" : 0,
        "content" : "@Livid 文中提到的 PubSubHubbub 目前还有计划实现吗?\u000D\u000A我现在在做的客户端正在实现未读消息提醒功能，如果 V2 有这个功能会方便很多。",
        "content_rendered" : "@\u003Ca target\u003D\u0022_blank\u0022 href\u003D\u0022/member/Livid\u0022\u003ELivid\u003C/a\u003E 文中提到的 PubSubHubbub 目前还有计划实现吗?\u000D\u003Cbr /\u003E我现在在做的客户端正在实现未读消息提醒功能，如果 V2 有这个功能会方便很多。",
        "member" : {
            "id" : 15042,
            "username" : "aliuwr",
            "tagline" : "",
            "avatar_mini" : "//cdn.v2ex.co/avatar/fbf8/ca43/15042_mini.png?m=1356502510",
            "avatar_normal" : "//cdn.v2ex.co/avatar/fbf8/ca43/15042_normal.png?m=1356502510",
            "avatar_large" : "//cdn.v2ex.co/avatar/fbf8/ca43/15042_large.png?m=1356502510"
        },
        "created" : 1435310335,
        "last_modified" : 1435310335
    },
    ...
    
]

curl https://www.v2ex.com/api/replies/show.json?topic_id=1
curl https://www.v2ex.com/api/replies/show.json?topic_id=1&page=1&page_size=2

## User

### Get information of user

/api/members/show.json?username=Livid
/api/members/show.json?id=1

{
    "status" : "found",
    "id" : 1,
    "url" : "http://www.v2ex.com/member/Livid",
    "username" : "Livid",
    "website" : "",
    "twitter" : "",
    "psn" : "",
    "github" : "",
    "btc" : "",
    "location" : "91789",
    "tagline" : "Gravitated and spellbound",
    "bio" : "I’ve managed to make something I could call my own world, over time, little by little. And when I’m inside it, I feel kind of relieved.",
    "avatar_mini" : "//cdn.v2ex.co/avatar/c4ca/4238/1_mini.png?m=1466415272",
    "avatar_normal" : "//cdn.v2ex.co/avatar/c4ca/4238/1_normal.png?m=1466415272",
    "avatar_large" : "//cdn.v2ex.co/avatar/c4ca/4238/1_large.png?m=1466415272",
    "created" : 1272203146
}

curl https://www.v2ex.com/api/members/show.json?username=Livid
curl https://www.v2ex.com/api/members/show.json?id=1


## Login
curl -X POST --data "a0e7d9c28220a6b0c6806338bf95141f24c7e4c93e7730dde19d3a64cb8b6f95=kzhiquan&b6d39b011839f84f1203a27ba7ca37c6170f7d66d6cc17126ec3c952755d5beb=kzhiquan62286507&once=77210&next=%2F" -v https://www.v2ex.com/signin


