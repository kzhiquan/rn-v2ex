import React from 'react';
import { 
	View, 
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';


import UserTopicListTableView from '../../components/UserTopicListTableView';
import UserReplyListTableView from '../../components/UserReplyListTableView';



class UserPage extends React.Component {

	constructor(props){
		super(props);
	}

	componentWillMount(){
		console.log('componentWillMount');
		const { userActions, route } = this.props;
		userActions.requestUser(route.path);
	}

	componentDidMount(){
		console.log('componentDidMount', this);
		//const { userActions, route } = this.props;
		//userActions.requestUser(route.path);
		//userActions.requestUserTopicList(route.path);
		//userActions.requestUserReplyList(route.path);
		//userActions.requestUser('/member/justyy');
		//userActions.requestUserTopicList('/member/justyy');
		//userActions.requestUserReplyList('/member/justyy');
		//userActions.requestUser('/member/t0byxdd');
	}

	componentWillUnmount(){
		console.log('componentWillUnmount');
		const { userActions } = this.props;
		userActions.cleanUser();
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

    _onBackClick(){
    	const { navigator } = this.props;
    	navigator.pop();
    }

    _renderNavigator(){
    	const { user, navigator } = this.props;
    	let hasRightButton = false;
    	let focusIconName = 'ios-heart-outline';
    	let blockIconName = 'ios-eye-outline';
    	if(user.user){
    		hasRightButton = true;
    		//console.log(user.user.focus_url);
    		if(user.user.focus_url && user.user.focus_url.indexOf('unfollow') > 0){
    			focusIconName = 'ios-heart';
    		}
    		//console.log(user.user.block_url);
    		if(user.user.block_url && user.user.block_url.indexOf('unblock') > 0){
    			blockIconName = 'ios-eye';
    		}
    	}

    	console.log('focusIconName', focusIconName, 'blockIconName', blockIconName);

	    return (
			<NavigationBar
				style={styles.navigatorBarStyle}
				statusBar={{
		            tintColor : '#FAFAFA'
		        }}
				leftButton={
					<TouchableOpacity onPress={this._onBackClick.bind(this)}>
            			<Image 
            				style={{left:12, top:11}} 
            				source={require('../../static/imgs/back_arrow.png')}
            			/>
          			</TouchableOpacity> 
				}
	            rightButton={
	            	hasRightButton ? 
		            	(<View style={{flexDirection:'row'}}>
		            		<TouchableOpacity onPress={this._onFocusUser.bind(this)}>
				                <Icon name={focusIconName} size={24} style={{marginRight:10, marginTop:12, right:4}} color="blue"/>
				            </TouchableOpacity> 
				            <TouchableOpacity onPress={this._onBlockUser.bind(this)}>
				                <Icon name={blockIconName} size={30} style={{marginRight:10, marginTop:9}} color="blue"/>
				            </TouchableOpacity> 
		            	</View>) : (<View></View>)
	            }
			/>
	    )
    }

    _renderUserMeta(){
    	let user = this.props.user.user;
    	//console.log('user', user);
    	if(user){
	    	return (
				<View style={styles.userMetaContainer}>
					<Image 
						style={styles.avatar_size_72}
						source={{uri:user.member_avatar}} 
					/>
					<View style={{marginTop:12}}>
						<Text style={{fontSize:16}}>{user.member_name}</Text>
					</View>
					<View style={styles.metaTextContainer}>
						<View style={[styles.directionRow, {marginTop:4}]}>
							<View>
								<Text style={styles.metaTextStyle}>{user.member_date.substr(3, 10) + '注册'}</Text>
							</View>
							<View>
								<Text style={styles.metaTextStyle}>{user.member_num.substr(7)}</Text>
							</View>
						</View>
						<View style={{marginTop:4}}>
							<Text style={styles.metaTextStyle}>{'今日活跃度' + user.active_num}</Text>
						</View>
					</View>
				</View>
	    	)
    	}
    }

    _renderScrollTableBar(){
	    return (
	      <ScrollableTabBar 
	        tabStyle={{ paddingRight:16, paddingLeft:16}}
	        tabsContainerStyle={{justifyContent:'center',}}
	      />
	    )
  	}

  	_renderTopicReplyTableView(){
		const { userActions, route, user, navigator} = this.props;
		let userTopicListPath = route.path + '/topics';
		let userReplyListPath = route.path + '/replies';
		//console.log('userTopicListPath', userTopicListPath);
		return (
			<ScrollableTabView
	          initialPage={0}
	          tabBarTextStyle={{fontSize:16}}
	          tabBarActiveTextColor={'black'}
	          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
	          renderTabBar={this._renderScrollTableBar.bind(this)}
	          >

				<UserTopicListTableView
					navigator = {navigator}
					actions = {{
						load : userActions.requestUserTopicList,
						refresh : userActions.refreshUserTopicList,
						loadMore : userActions.loadMoreUserTopicList,
					}}
					payload = {user.topicListExt}
					path={userTopicListPath}
					key={0} 
					tabLabel={'主题'}
				/>

				<UserReplyListTableView
					navigator = {navigator}
					actions = {{
						load : userActions.requestUserReplyList,
						refresh : userActions.refreshUserReplyList,
						loadMore : userActions.loadMoreUserReplyList,
					}}
					payload = {user.replyListExt}
					path={userReplyListPath}
					key={1} 
					tabLabel={'回复'}
				/>

	        </ScrollableTabView>
		)
  	}

	render() {
		return (
			<View style={styles.container}>

				{ this._renderNavigator() }
				{ this._renderUserMeta() }

				{ this._renderTopicReplyTableView()}

			</View>
		);
  	}

}


const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = '#EFEFF4';
let tabBarUnderlineColor = '#007AFF';

const styles = StyleSheet.create({

	directionRow:{
		flexDirection : 'row',
	},

	container : {
	    flex : 1,
	    backgroundColor : 'white',
	},

	navigatorBarStyle:{
		backgroundColor : '#FAFAFA', 
		borderBottomWidth : 1,
		borderBottomColor : borderColor,
	},

	userMetaContainer:{
		alignItems:'center',
		top:12,
		paddingBottom:12,
	},
	avatar_size_72:{
	    width:72,
	    height:72,
	    borderRadius: 8,
  	},

  	metaTextContainer:{
		alignItems:'center',
  	},
  	metaTextStyle:{
	    fontSize:12, 
	    color:noteTextColor,
  	},

  	tabBarUnderlineStyle:{
	    backgroundColor : tabBarUnderlineColor,
	    height:2,
  	},

});


export default UserPage;