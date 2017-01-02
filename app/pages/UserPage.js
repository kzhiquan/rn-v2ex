import React from 'react';
import { 
	View, 
	Text,
	ListView,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
	ActivityIndicator,
	RecyclerViewBackedScrollView,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';

import { toastShort } from '../utils/ToastUtil';
import LoadingView from '../components/LoadingView';
import TopicContainer from '../containers/TopicContainer';


const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
let canLoadMore;
let topicPage = 1;
let replyPage = 1;
let loadMoreTime = 0;


class UserPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
        	dataSource: new ListView.DataSource({
        		rowHasChanged: (r1, r2) => r1 !== r2,
        		sectionHeaderHasChanged: (h1, h2) => h1 !== h2, 
        	} ),
        	topicShowing:true,
    	};
    	canLoadMore = false;
    	topicPage = 1;
    	replyPage = 1;
	}


	componentWillMount(){
		console.log('componentWillMount');
	}

	componentDidMount(){
		console.log('componentDidMount', this);
		console.log('this.props', this.props);
		const { userActions, route } = this.props;
		userActions.requestUser(route.path);
		userActions.requestUserTopicList(route.path);
		userActions.requestUserReplyList(route.path);
		//userActions.requestUser('/member/justyy');
		//userActions.requestUserTopicList('/member/justyy');
		//userActions.requestUserReplyList('/member/justyy');
		//userActions.requestUser('/member/t0byxdd');
	}

	_topicClick(){
		console.log('topicClick', this);
		const { navigator, topic } = this;
	    navigator.push({
	      component : TopicContainer,
	      name : 'Topic',
	      topic : topic,
	    });
	}

	_renderTopicItem(topic){
		const { navigator } = this.props
		return (
		  <TouchableOpacity onPress={this._topicClick} topic={topic} navigator={navigator}>
		    <View style={styles.containerItem}>
		      <View style={styles.itemBody}>
		        <Text>{topic.topic_title}</Text>
		        <View style={styles.itemBodyDetail}>
		          <Text>{topic.node_name}</Text>
		          <Text>{topic.member_name}</Text>
		          <Text>{topic.date}</Text>
		          <Text>{topic.latest_reply_member_name}</Text>
		        </View>
		      </View>
		      <Text style={styles.itemFooter}>{topic.reply_count}</Text>
		    </View>
		  </TouchableOpacity>
		);
	}

	_renderNode(node, index, parent, type) {
	    if (node.name === 'img') {
	        let uri = node.attribs.src;
	        if(uri.indexOf('http') == -1){
	          uri = 'http:' + uri;
	        }

	        return (
	                <View key={index} style={{flex:1, flexDirection:'row', justifyContent: 'center', width:maxWidth, height:maxWidth,}}>
	                  <Image 
	                    source={{uri:uri}} 
	                    style={{
	                      width:maxWidth-30,
	                      height:maxWidth-30,
	                      resizeMode: Image.resizeMode.contain}} />
	                </View>
	        )
	    }
  	}

	_onLinkPress(url){
		console.log('url', url);
	}

	_renderReplyItem(reply){
		const { navigator } = this.props;
		return (
			<TouchableOpacity onPress={this._topicClick} topic={reply.topic} navigator={navigator}>
				<View style={{borderBottomWidth:1}}>
					<View>
						<Text>{reply.date} {reply.topic.topic_title}</Text>
					</View>
					<View>
						<HtmlRender
				            key={reply.topic.topic_url}
				            value={'<div>' + reply.content + '</div>'}
				            onLinkPress={this._onLinkPress.bind(this)}
				            renderNode={this._renderNode}
				        />
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	_renderUserItem(user){
		return (
			<View style={{flex:1, alignItems:'center'}}>
				<Image style={{width:48, height:48}}source={{uri:user.member_avatar}} />
				<View><Text>{user.member_name}</Text></View>
				<View style={{flex:1, alignItems:'center'}}>
					<View><Text>{user.member_date}</Text></View>
					<View><Text>{user.member_num}</Text></View>
				</View>
			</View>
		);
	}

	renderItem(item, sectionID, rowID, highlightRow){
		if(sectionID === 'account'){
			return this._renderUserItem(item);
		}else if( sectionID === 'activity' && item){
			if(this.state.topicShowing){
				return this._renderTopicItem(item);
			}else{
				return this._renderReplyItem(item);
			}
		}
		return null;
	}

	_onShowTopicClick(){
		console.log('_onShowTopicClick');
		this.refs.list.scrollTo({y:0, animated:false});
		this.setState({
			topicShowing:true,
		});
	}

	_onShowReplyClick(){
		console.log('_onShowTopicClick');
		this.refs.list.scrollTo({y:0, animated:false});
		this.setState({
			topicShowing:false,
		});
	}

	onEndReached() {
		//console.log('outer onEndReached page', page);
		const time = Date.parse(new Date()) / 1000;
		if (canLoadMore && time - loadMoreTime > 1) {
		  canLoadMore = false;
		  loadMoreTime = Date.parse(new Date()) / 1000;

		  const { userActions, route } = this.props;
		  if (this.state.topicShowing){
		  	topicPage += 1;
		  	//userActions.requestUserTopicList('/member/justyy', topicPage);
		  	userActions.requestUserTopicList(route.path, topicPage);
		  }else{
		  	replyPage += 1;
		  	//userActions.requestUserReplyList('/member/justyy', replyPage);
		  	userActions.requestUserReplyList(route.path, replyPage);
		  }
		}
	}

	renderFooter(){
	    const { user } = this.props;
	    if(user.isTopicListLoadingMore || user.isReplyListLoadingMore){
	      return (
	        <View style={styles.footerContainer} >
	          <ActivityIndicator size="small" color="#3e9ce9" />
	          <Text style={styles.footerText}>
	            数据加载中……
	          </Text>
	        </View>
	      );
	    }
	}

	onScroll() {
	    if (!canLoadMore) {
	      canLoadMore = true;
	    }
	}

    renderSectionHeader(sectionData, sectionID){
		if(sectionID === 'activity'){
			return (
				<View style={{flex:1, flexDirection:'row', justifyContent:'space-around', backgroundColor:'gray'}}>
					<TouchableOpacity onPress={ () => this._onShowTopicClick() }>
						<View><Text>主题</Text></View>
					</TouchableOpacity>
					<TouchableOpacity onPress={ () => this._onShowReplyClick() }>
						<View><Text>回复</Text></View>
					</TouchableOpacity>
				</View>
			);
		}else{
			return null;
		}
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    	return null;
    }

    _onFocusUser(){
    	//console.log('_onFocusUser');
    	const { userActions, user } = this.props;
    	//console.log('user', user);
    	userActions.requestFocusUser(user.user);
    }

    _onBlockUser(){
    	//console.log('_onBlockUser');
    	const { userActions, user } = this.props;
    	userActions.requestBlockUser(user.user);
    }

    _renderNavigator(){
    	const { user, navigator } = this.props;
    	let hasRightButton = false;
    	let focusIconName = 'ios-heart-outline';
    	let blockIconName = 'ios-eye-outline';
    	if(user.user){
    		hasRightButton = true;
    		//console.log(user.user.focus_url);
    		if(user.user.focus_user && user.user.focus_url.indexOf('unfollow') > 0){
    			focusIconName = 'ios-heart';
    		}
    		//console.log(user.user.block_url);
    		if(user.user.block_url && user.user.block_url.indexOf('unblock') > 0){
    			blockIconName = 'ios-eye';
    		}
    	}

    	let titleConfig = {
			title: '个人'
		};
		var leftButtonConfig = {
			title: 'Back',
			handler: function onBack() {
				navigator.pop();
			}
	    };

	    console.log('this', this);

	    return (
				<NavigationBar
					title={titleConfig}
					leftButton={leftButtonConfig}
		            rightButton={
		            	hasRightButton ? 
			            	(<View style={{flexDirection:'row'}}>
			            		<TouchableOpacity onPress={this._onFocusUser.bind(this)}>
					                <Icon name={focusIconName} size={30} style={{marginRight:10, marginTop:10}} color="blue"/>
					            </TouchableOpacity> 
					            <TouchableOpacity onPress={this._onBlockUser.bind(this)}>
					                <Icon name={blockIconName} size={30} style={{marginRight:10, marginTop:10}} color="blue"/>
					            </TouchableOpacity> 
			            	</View>) : (<View></View>)
		            }
				/>
	    )

    }

	render() {
		//console.log('this', this);
		const { user, navigator } = this.props;


		let rows = {
			'account' : [],
			'activity' : [null]
		}

		if(user.user){
			rows['account'] = [user.user];

		}

		if(user.topicList && this.state.topicShowing){
			rows['activity'] = user.topicList.topicList; 
		}

		if(user.replyList && !this.state.topicShowing){
			rows['activity'] = user.replyList.replyList;
		}


		//console.log('rows', rows);
		return (
			<View style={{flex:1}}>

				{ this._renderNavigator() }
    			<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
					renderRow={this.renderItem.bind(this)}
					renderSectionHeader = {this.renderSectionHeader.bind(this)}
					renderSeparator = {this.renderSeparator.bind(this)}
					renderFooter={this.renderFooter.bind(this)}
					onEndReachedThreshold={-50}
      				onEndReached={this.onEndReached.bind(this)}
      				onScroll={this.onScroll}
      				ref="list"
      				enableEmptySections = {true}
					removeClippedSubviews = {false}
					renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
				/>
				<ActivityIndicator
		            animating={ user.isLoading || user.isTopicListLoading }
		            style={styles.front}
		            size="large"
		        />

			</View>
		);
  	}

}


const styles = StyleSheet.create({
  containerItem:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  itemBody:{
    width:280
  },
  itemBodyDetail:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  itemFooter:{
    color:'blue',
    paddingTop: 18
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },

  front:{
    position: 'absolute',
    top:300,
    left: (375-50)/2,
    width: 50,
    height:50,
    zIndex: 1,
  },

});


export default UserPage;