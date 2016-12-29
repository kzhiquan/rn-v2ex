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
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import LoginContainer from '../../containers/auth/LoginContainer';
import AccountContainerExt from '../../containers/auth/AccountContainerExt';



class SetPage extends React.Component {

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

	componentWillReceiveProps(nextProps){
		const { navigator, auth } = nextProps;
		//console.log('auth', auth);
		if( auth.user == null ){
			navigator.resetTo({
				component: LoginContainer,
				name : 'LoginPage',
			});
			/*if(auth.accounts.length == 0){
				navigator.resetTo({
					component: LoginContainer,
					name : 'LoginPage',
				});
			}else{
				navigator.push({
					component : AccountContainerExt,
					name : 'AccountPage',
				});
			}*/
		}
	}

	_onBackClick(){
		const { navigator } = this.props;
		navigator.pop();
	}

	_onAccountClick(){
		console.log('_onAccountClick');
		const { navigator } = this.props;
		navigator.push({
			component : AccountContainerExt,
			name : 'AccountPage',
		});
	}

	_onFontAndPresentClick(){
		console.log('_onFontAndPresentClick');
	}

	_onAboutAppClick(){
		console.log('_onAboutAppClick');
	}

	_onLogoutClick(){
		//console.log('_onLogoutClick');
		const { auth, authActions } = this.props;
		authActions.userLogout(auth.user);
	}

	_renderLogoutCell(item, sectionID, rowID, highlightRow,cellContainerStyle){
		const { navigator } = this.props;
		return (
			<TouchableOpacity 
				onPress={item.onClick} 
				item={item} 
				navigator={navigator}
				style={[cellContainerStyle,{'top' : 292}]}>

			 	<View style={[styles.cellStyle, {'justifyContent' : 'center'}]}>
			  		<View style={{paddingTop:14}}>
			          <Text>{item.name}</Text>
			        </View>
			    </View>

			</TouchableOpacity>
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
			        <Image style={{top:14, right:12}} source={require('../../static/imgs/arrow.png')}/>
			    </View>

			</TouchableOpacity>
		);
	}

	renderItem(item, sectionID, rowID, highlightRow){

		let cellContainerStyle = {backgroundColor:'white'};

		if(sectionID == 'one'){

			cellContainerStyle = [cellContainerStyle, styles.firstCellContainer, styles.lastCellContainer];

		}else if(sectionID == 'two' && rowID == 0 ){

			cellContainerStyle = [cellContainerStyle, styles.firstCellContainer];

		}else if(sectionID == 'two' && rowID == 1){

			cellContainerStyle = [cellContainerStyle, styles.lastCellContainer];

		}else if( sectionID == 'three'){

			cellContainerStyle = [cellContainerStyle, styles.firstCellContainer, styles.lastCellContainer];

			return this._renderLogoutCell(item, sectionID, rowID, highlightRow, cellContainerStyle);
		}


		return this._renderCell(item, sectionID, rowID, highlightRow, cellContainerStyle);
	}

    renderSectionHeader(sectionData, sectionID){
		return (
	      <View
	        key={`${sectionID}`}
	        style={styles.headerSection}
	      />
	    );
    }

	render() {
		const { auth } = this.props;

		let titleConfig = {
			title: '设置'
		};

		let rows = [];
		if(auth.user){
			rows = {
				'one' : [
					{
						name:'账户',
						onClick : this._onAccountClick.bind(this),
					}
				],

				'two' : [
					{
						name : '字体与显示',
						onClick : this._onFontAndPresentClick.bind(this),
					},
					{
						name : '关于V2EX',
						onClick : this._onAboutAppClick.bind(this),
					}
				],

				'three' :[
					{
						name : '退出登录',
						onClick : this._onLogoutClick.bind(this),
					}
				],
			}
		}


		return (
			<View style={styles.container}>

				<NavigationBar
					style={styles.navigatorBarStyle}
					title={titleConfig}
					leftButton={
						<TouchableOpacity onPress={this._onBackClick.bind(this)}>
                			<Image style={{left:12, top:11}}source={require('../../static/imgs/back_arrow.png')}/>
              			</TouchableOpacity> 
					}
					statusBar={{
			            tintColor : '#FAFAFA'
			        }}
				/>

				<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
					renderRow={this.renderItem.bind(this)}
					renderSectionHeader = {this.renderSectionHeader.bind(this)}
					removeClippedSubviews = {false}
				/>

				<ActivityIndicator
		          animating={ auth.isLoading }
		          style={styles.front}
		          size="large"
		        />

			</View>
		);
  	}

}

const {height, width} = Dimensions.get('window');
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

	front:{
	    position: 'absolute',
	    top:300,
	    left: (width-50)/2,
	    width: 50,
	    height:50,
	    zIndex: 1,
  	},

	navigatorBarStyle:{
		backgroundColor : '#FAFAFA', 
		borderBottomWidth : 1,
		borderBottomColor : borderColor,
	},

	//custom
	container : {
		flex : 1,
		backgroundColor : backgroundColor,
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


export default SetPage;