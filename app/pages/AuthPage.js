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

import AccountContainer from '../containers/AccountContainer';
import MyTopicListContainer from '../containers/MyTopicListContainer';
import MyReplyListContainer from '../containers/MyReplyListContainer';
import MyNodeListContainer from '../containers/MyNodeListContainer';
import MyFavoriteTopicListContainer from '../containers/MyFavoriteTopicListContainer';
import SetContainer from '../containers/SetContainer';


class AuthPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
        	dataSource: new ListView.DataSource({
        		rowHasChanged: (r1, r2) => r1 !== r2,
        		sectionHeaderHasChanged: (h1, h2) => h1 !== h2, 
        	} )
    	};
	}

	componentWillMount(){
		//console.log('componentWillMount');
	}

	componentDidMount(){
		//console.log('componentDidMount');
	}

	_onSetClick(){
		const { navigator } = this.props;
		navigator.push({
	        component : SetContainer,
	        name:'SetPage'
		});
	}

	_onMyTopicClick(){
		const { navigator, auth } = this.props;
		navigator.push({
			component : MyTopicListContainer,
			name : 'MyTopicPage',
			user : auth.user,
		});
	}

	_onMyReplyClick(){
		const { navigator, auth } = this.props;
		navigator.push({
			component : MyReplyListContainer,
			name : 'MyReplyPage',
			user : auth.user,
		});
	}

	_onMyNodeClick(){
		const { navigator } = this.props;
		navigator.push({
			component : MyNodeListContainer,
			name : 'MyNodePage'
		});
	}

	_onMyFavoriteTopicClick(){
		const { navigator } = this.props;
		navigator.push({
			component : MyFavoriteTopicListContainer,
			name : 'MyFavoriteTopicPage',
			node : {
				name : '我收藏的主题',
				path : '/my/topics',
			}
		});
	}


	_renderAccountMeta(user, sectionID, rowID, highlightRow){
		//console.log('user', user);
		return (
			<View style={[styles.accountMetaContainer,styles.lastCellContainer]}>
				<View style={styles.directionRow}>
					<Image
						style={styles.avatar_size_42}
        				source={{uri:user.avatar_url}}
      				/>
      				<View style={styles.avartarMetaContainer}>
      					<View>
      						<Text style={{fontSize:16}}>{user.name}</Text>
      					</View>
      					<View style={styles.directionRow}>

	      					<View style={[styles.directionRow,{marginRight:8}]}>
	      						<View>
	      							<Text style={styles.metaTextStyle}>{user.silver_count}</Text>
	      						</View> 
	      						<Image source={require('../static/imgs/silver.png')}/>
	      					</View>

	      					<View style={styles.directionRow}>
	      						<View>
	      							<Text style={styles.metaTextStyle}>{user.gold_count}</Text>
	      						</View> 
	      						<Image source={require('../static/imgs/gold.png')}/>
	      					</View>

      					</View>
      				</View>
				</View>

				<View style={{marginTop:14}}>
					<Text style={{fontSize:14}}>{user.words}</Text>
				</View>

  				<View style={[styles.directionRow, {marginTop:12}]}>
					<View style={[styles.directionRow, {marginRight:32}]}>
						<View>
							<Text style={styles.metaTextStyle}>{user.favorite_topic_count} 个主题</Text>
						</View>
					 	<Image style={{left:2, bottom:4}} source={require('../static/imgs/topic.png')}/>
					</View>
					<View style={[styles.directionRow,{marginRight:32}]}>
						<View>
							<Text style={styles.metaTextStyle}>{user.favorite_node_count} 个节点</Text>
						</View> 
						<Image style={{left:2, bottom:3}} source={require('../static/imgs/bookmark.png')}/>
					</View>
					<View style={styles.directionRow}>
						<View>
							<Text style={styles.metaTextStyle}>{user.focus_user_count} 个人</Text>
						</View>
						<Image style={{left:2}} source={require('../static/imgs/person.png')}/>
					</View>
				</View>
			</View>
		);
	}

	_renderCell(item, sectionID, rowID, highlightRow, cellContainerStyle){
		const { navigator } = this.props;
		return (
			<TouchableOpacity 
				onPress={item.onClick} 
				item={item} 
				navigator={navigator}
				style={cellContainerStyle}>

			 	<View style={styles.cellStyle}>
			        <View style={{paddingTop:14}}>
			          <Text>{item.name}</Text>
			        </View>
			        <Image style={{top:14, right:12}} source={require('../static/imgs/arrow.png')}/>
			    </View>

			</TouchableOpacity>
		);
	}

	_renderAccountBody(item, sectionID, rowID, highlightRow){

		let cellContainerStyle = {backgroundColor:'white'};
		if(rowID == 0){
			cellContainerStyle = [cellContainerStyle, styles.firstCellContainer];
		}else if( rowID == 3){
			cellContainerStyle = [cellContainerStyle, styles.lastCellContainer];
		}

		return this._renderCell(item, sectionID, rowID, highlightRow, cellContainerStyle);
	}

	_renderSet(item, sectionID, rowID, highlightRow){

		let cellContainerStyle = {backgroundColor:'white'};
		if(rowID == 0){
			cellContainerStyle = [cellContainerStyle, styles.firstCellContainer, styles.lastCellContainer];
		}

		return this._renderCell(item, sectionID, rowID, highlightRow, cellContainerStyle);
	}

	renderItem(item, sectionID, rowID, highlightRow){
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
		        style={styles.headerSection}
		      />
		    );
		}
    }

	render() {
		const { auth } = this.props;
		let titleConfig = {
			title: '个人'
		};

		let rows = [];
		if(auth.user){
			rows = {
				'account' : [auth.user],
				'favorite' : [{
								name: '我的主题',
								onClick : this._onMyTopicClick.bind(this),
							  },{
							  	name: '我的回复',
							  	onClick: this._onMyReplyClick.bind(this),
							  },{
							  	name : '主题收藏',
							  	onClick : this._onMyFavoriteTopicClick.bind(this),
							  },{
							  	name : '节点收藏',
							  	onClick : this._onMyNodeClick.bind(this),
							  }],
				'set' : [{
							name:'设置',
							onClick : this._onSetClick.bind(this),
						}],
			}
		}


		return (
			<View style={styles.container}>

				<NavigationBar
					style={styles.navigatorBarStyle}
					title={titleConfig}
				/>

				<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
					renderRow={this.renderItem.bind(this)}
					renderSectionHeader = {this.renderSectionHeader.bind(this)}
					removeClippedSubviews = {false}
				/>

			</View>
		);
  	}

}

let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = '#EFEFF4';

const styles = StyleSheet.create({
	//common
	directionRow:{
		flexDirection : 'row',
	},

	avatar_size_42:{
		width:42,
		height:42,
	},

	container : {
		flex : 1,
		backgroundColor : backgroundColor,
	},
	navigatorBarStyle:{
		backgroundColor : 'white', 
		borderBottomWidth : 1,
		borderBottomColor : borderColor,
	},
	accountMetaContainer:{
		backgroundColor:'white', 
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
		color:noteTextColor,
	},

	headerSection :{
	    height: 16,
	  	//borderBottomWidth:1, 
	  	//borderTopColor:'#B2B2B2',
	  	//borderTopWidth:1,
		//borderBottomColor:'#B2B2B2',
	},

	sectionBorder:{
		borderBottomWidth:1, 
		borderBottomColor:borderColor,
	},

	firstCellContainer:{
		backgroundColor:'white',
		borderTopWidth : 1,
		borderTopColor : borderColor,
	},
	lastCellContainer:{
		backgroundColor:'white',
		borderBottomWidth : 1,
		borderBottomColor : borderColor,
	},
	cellStyle:{
		flex:1,
		flexDirection:'row',
		borderBottomWidth:1,
		borderBottomColor:cellBorderColor,
		height:44,
		justifyContent: 'space-between',
		marginLeft:16,
	},
});


export default AuthPage;