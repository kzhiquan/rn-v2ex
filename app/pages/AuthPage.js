import React from 'react';
import { 
	View, 
	Text,
	ListView,
	StyleSheet,
	TouchableOpacity, 
	Image,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import { toastShort } from '../utils/ToastUtil';
import AccountContainer from '../containers/AccountContainer';
import MyTopicListContainer from '../containers/MyTopicListContainer';
import MyReplyListContainer from '../containers/MyReplyListContainer';
import MyNodeListContainer from '../containers/MyNodeListContainer';
import MyFavoriteTopicListContainer from '../containers/MyFavoriteTopicListContainer'


class AuthPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
        	dataSource: new ListView.DataSource({
        		rowHasChanged: (r1, r2) => r1 !== r2,
        		sectionHeaderHasChanged: (h1, h2) => h1 !== h2, 
        	} )
    	};
    	this.renderItem = this.renderItem.bind(this);
    	this.onPressButton = this.onPressButton.bind(this);
	}


	componentWillMount(){
		console.log('componentWillMount');
	}

	componentDidMount(){
		console.log('componentDidMount');
	}


	onPressButton(){
		//console.log('onPressButton');
		const { navigator } = this.props;
		navigator.push({
	        component : AccountContainer,
	        name:'Account'
		});
	}

	onFavoriteClick(){
		//console.log('onFavoriteClick', this);
		const { item, navigator } = this;

		if(item.name === '我的主题'){
			navigator.push({
				component : MyTopicListContainer,
				name : 'My Topic'
			})
		}else if(item.name === '我的回复'){
			navigator.push({
				component : MyReplyListContainer,
				name : 'My Reply'
			})
		}else if(item.name === '节点收藏'){
			navigator.push({
				component : MyNodeListContainer,
				name : 'My NodeList'
			});
		}else if(item.name === '主题收藏'){
			navigator.push({
				component : MyFavoriteTopicListContainer,
				name : 'My Favorite TopicList',
				node : {
					name : '我收藏的主题',
					path : '/my/topics',
				}
			})
		}else if(item.name === '特别关注'){
			navigator.push({
				component : MyFavoriteTopicListContainer,
				name : 'My Focus TopicList',
				node : {
					name : '我关注的主题',
					path : '/my/following',
				}
			});
		}
	}

	_renderAccountMeta(item, sectionID, rowID, highlightRow){
		const { navigator, auth } = this.props;
		return (
			/*<TouchableOpacity onPress={this.onPressButton}>
			 	<View style={styles.containerItem}>
			 		<Icon name="ios-contact-outline" size={48} />
			        <View style={styles.itemBody}>
			          <Text>{item.name}</Text>
			        </View>
			        <Icon name="ios-arrow-forward" size={24} style={{top:16}}/>
			    </View>
			</TouchableOpacity>*/
			<View style={styles.accountMetaContainer}>
				<View style={styles.rowContainer}>
					<Image
						style={{width:42, height:42}}
        				source={require('../static/imgs/logo.png')}
      				/>
      				<View style={styles.avartarMetaContainer}>
      					<View>
      						<Text style={{fontSize:16}}>知了</Text>
      					</View>
      					<View style={styles.rowContainer}>

	      					<View style={[styles.rowContainer,{marginRight:8}]}>
	      						<View>
	      							<Text style={styles.metaTextStyle}>10</Text>
	      						</View> 
	      						<Image source={require('../static/imgs/silver.png')}/>
	      					</View>

	      					<View style={styles.rowContainer}>
	      						<View>
	      							<Text style={styles.metaTextStyle}>7</Text>
	      						</View> 
	      						<Image source={require('../static/imgs/gold.png')}/>
	      					</View>

      					</View>
      				</View>
				</View>

				<View style={{marginTop:14}}>
					<Text style={{fontSize:14}}>Code And Life</Text>
				</View>

  				<View style={[styles.rowContainer, {marginTop:12}]}>
					<View style={[styles.rowContainer, {marginRight:32}]}>
						<View>
							<Text style={styles.metaTextStyle}>38 个主题</Text>
						</View>
					 	<Image style={{left:2, bottom:4}} source={require('../static/imgs/topic.png')}/>
					</View>
					<View style={[styles.rowContainer,{marginRight:32}]}>
						<View>
							<Text style={styles.metaTextStyle}>4 个节点</Text>
						</View> 
						<Image style={{left:2, bottom:3}} source={require('../static/imgs/bookmark.png')}/>
					</View>
					<View style={styles.rowContainer}>
						<View>
							<Text style={styles.metaTextStyle}>10 个人</Text>
						</View>
						<Image style={{left:2}} source={require('../static/imgs/person.png')}/>
					</View>
				</View>
			</View>
		);
	}

	_renderAccountBody(item, sectionID, rowID, highlightRow){
		const { navigator } = this.props;

		return (
			<TouchableOpacity 
				onPress={item.onClick} 
				item={item} 
				navigator={navigator}
				style={{backgroundColor:'white'}}>

			 	<View style={styles.itemContainer}>
			        <View style={{top:14}}>
			          <Text>{item.name}</Text>
			        </View>
			        <Image style={{top:14, right:12}} source={require('../static/imgs/arrow.png')}/>
			    </View>

			</TouchableOpacity>
		);
	}

	_renderSet(item, sectionID, rowID, highlightRow){
		const { navigator } = this.props;
		return (
			<TouchableOpacity 
				onPress={item.onClick} 
				item={item} 
				navigator={navigator}
				style={{backgroundColor:'white', borderBottomWidth:1, borderBottomColor:'#B2B2B2'}}>

			 	<View style={styles.itemContainer}>
			        <View style={{top:14}}>
			          <Text>设置</Text>
			        </View>
			        <Image style={{top:14, right:12}} source={require('../static/imgs/arrow.png')}/>
			    </View>

			</TouchableOpacity>
		);
	}

	renderItem(item, sectionID, rowID, highlightRow){
		const { navigator } = this.props;
		if(sectionID == 'account'){
			return this._renderAccountMeta(item, sectionID, rowID, highlightRow);
		}else if(sectionID == 'favorite'){
			return this._renderAccountBody(item, sectionID, rowID, highlightRow);
		}else{
			return this._renderSet(item, sectionID, rowID, highlightRow);
		}
	}

    renderSectionHeader(sectionData, sectionID){
		if(sectionID === 'account'){
			return null;
		}else{
			return (
		      <View
		        key={`${sectionID}`}
		        style={{
		          	height: 16,
				  	borderBottomWidth:1, 
				  	borderTopColor:'#B2B2B2',
				  	borderTopWidth:1,
					borderBottomColor:'#B2B2B2',
		        }}
		      />
		    );
		}
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    	return (
			<View
				key={`${sectionID}-${rowID}`}
				style={{
				  height: 1,
				  backgroundColor:'#EAEAEC',
				  left:16,
				}}
			/>
		);
    }

	render() {
		const { auth } = this.props;
		let titleConfig = {
			title: '个人'
		};

		let rows;
		if (auth.user){
			rows = {
				'account' : [auth.user],
				'favorite' : [{
								name: '我的主题',
								icon: 'ios-bookmark-outline',
								onClick : this.onFavoriteClick,
							  },{
							  	name: '我的回复',
							  	icon: 'ios-chatbubbles-outline',
							  	onClick: this.onFavoriteClick,
							  },{
							  	name : '主题收藏',
							  	icon : 'ios-star-outline',
							  	onClick : this.onFavoriteClick,
							  },{
							  	name : '节点收藏',
							  	icon : 'ios-heart-outline',
							  	onClick : this.onFavoriteClick,
							  }],
				'set' : [{
							name:'设置',
						}],
			}
		}else{
			rows = {
				'account' : [{
					name : '尚未登陆，请登陆'
				}]
			}
		}

		//console.log('rows', rows, this.props);
		return (
			<View style={styles.container}>

				<NavigationBar
					style={styles.navigatorBarStyle}
					title={titleConfig}
				/>

				<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
					renderRow={this.renderItem}
					renderSectionHeader = {this.renderSectionHeader}
					//renderSeparator = {this.renderSeparator}
					removeClippedSubviews = {false}
				/>

			</View>
		);
  	}

}


const styles = StyleSheet.create({
	rowContainer:{
		flexDirection : 'row',
	},
	container : {
		flex : 1,
		backgroundColor : '#EFEFF4',
	},
	navigatorBarStyle:{
		backgroundColor : '#ffffff', 
		borderBottomWidth : 1,
		borderBottomColor : '#B2B2B2',
	},
	accountMetaContainer:{
		backgroundColor:'white', 
		//borderBottomWidth:1, 
		//borderBottomColor:'#B2B2B2',
		paddingTop:12,
		paddingLeft:16,
		paddingBottom:12,
	},
	avartarMetaContainer:{
		paddingLeft:10,
		justifyContent:'space-between',
	},

	metaTextStyle:{
		fontSize:12, 
		color:'#BBC5CD',
	},

	itemContainer:{
		flex:1,
		flexDirection:'row',
		//borderBottomWidth:1,
		//borderBottomColor:'#EAEAEC',
		height:44,
		justifyContent: 'space-between',
		marginLeft:16,
	},
});


export default AuthPage;