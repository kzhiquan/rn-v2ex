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
import AddAccountContainer from '../containers/AddAccountContainer';
import MainPage from './MainPage';




class AccountPageExt extends React.Component {

	constructor(props){
		super(props);
		this.state = {
        	dataSource: new ListView.DataSource({
        		rowHasChanged: (r1, r2) => r1 !== r2
        	} )
    	};
	}

	componentWillMount(){
		console.log('componentWillMount');
	}

	componentDidMount(){
		console.log('componentDidMount');
	}

	componentWillReceiveProps(nextProps){
		const { navigator, auth } = nextProps;
		if( this.props.auth.user && this.props.auth.user.name != auth.user.name){
			navigator.resetTo({
				component: MainPage,
				name : 'main',
			});
		}	
	}

	_onBackClick(){
		const { navigator } = this.props;
		navigator.pop();
	}

	_onAddAccountClick(){
		const { navigator } = this;
		navigator.push({
			component : AddAccountContainer,
			name : 'AddAcountPage',
		});
	}

	_onChangeUserClick(){
		const { that, item } = this;
		const { auth, authActions } = that.props;
		if( !auth.user || (auth.user && auth.user.name != item.name)) {
			authActions.changeUser(item);
		}
	}

	_renderAccountItem(item, sectionID, rowID, highlightRow,cellContainerStyle){
		const { auth } = this.props;
		let flag = false;
		if(auth.user && auth.user.name == item.name){
			flag = true;
		}
		return (
			<TouchableOpacity
				style={cellContainerStyle}
				item={item}
				that={this}
				onPress={this._onChangeUserClick}>
			 	<View style={styles.cellStyle}>
			 		<Image
						style={[styles.avatar_size_42, {top:9, borderRadius:21,}]}
        				source={{uri:item.avatar_url}}
      				/>
      				<View style={[styles.directionRow, {flex: 1, justifyContent:'space-between'}]}>
      					<View style={{paddingTop:22, left:10}}>
			          		<Text>{item.name}</Text>
			        	</View>
			        	{flag && <Image style={{top:22, right:12}} source={require('../static/imgs/checkmark.png')}/>}
      				</View>
			    </View>
			</TouchableOpacity>
		);
	}

	_renderAddItem(item, sectionID, rowID, highlightRow,cellContainerStyle){
		const { navigator } = this.props; 
		return (
			<TouchableOpacity
				style={cellContainerStyle}
				navigator={navigator}
				onPress={this._onAddAccountClick}
				>
			 	<View style={styles.cellStyle}>
					<Image 
						style={{top:17,left:9}} 
						source={require('../static/imgs/plus.png')}/>

			        <View style={{paddingTop:22, left:22}}>
			          <Text>{item.name}</Text>
			        </View>

			    </View>
			</TouchableOpacity>
		);
	}

	renderItem(item, sectionID, rowID, highlightRow){

		let cellContainerStyle = {backgroundColor:'white'};
		if(rowID == 0){
			cellContainerStyle = [cellContainerStyle, styles.firstCellContainer];
		}

		if(item.name== '添加账户'){

			cellContainerStyle = [cellContainerStyle, styles.lastCellContainer];

			return this._renderAddItem(item, sectionID, rowID, highlightRow,cellContainerStyle);

		}else{

			return this._renderAccountItem(item, sectionID, rowID, highlightRow,cellContainerStyle);

		}
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
			title: '账户'
		};

		let rows = auth.accounts.concat([{
			name: '添加账户',
		}]);

		return (
			<View style={styles.container}>

				<NavigationBar
					style={styles.navigatorBarStyle}
					title={titleConfig}
					leftButton={
						<TouchableOpacity onPress={this._onBackClick.bind(this)}>
                			<Image style={{left:12, top:11}} source={require('../static/imgs/back_arrow.png')}/>
              			</TouchableOpacity> 
					}
				/>

				<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRows(rows)}
					renderRow={this.renderItem.bind(this)}
					removeClippedSubviews = {false}
					renderSectionHeader = {this.renderSectionHeader.bind(this)}
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
		backgroundColor : 'white', 
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


	//table css
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
		height:60,
		marginLeft:16,
	},
});


export default AccountPageExt;