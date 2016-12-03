import React from 'react';
import { 
	View, 
	Text,
	ListView,
	StyleSheet,
	TouchableOpacity, 
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import { toastShort } from '../utils/ToastUtil';
import AccountContainer from '../containers/AccountContainer';
import MyTopicListContainer from '../containers/MyTopicListContainer';
import MyReplyListContainer from '../containers/MyReplyListContainer';


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

		if( item.name === '我的主题'){
			navigator.push({
				component : MyTopicListContainer,
				name : 'My Topic'
			})
		}else{
			navigator.push({
				component : MyReplyListContainer,
				name : 'My Reply'
			})
		}


	}

	renderItem(item, sectionID, rowID, highlightRow){
		//console.log(item, sectionID, rowID);
		const { navigator } = this.props;
		if(sectionID == 'account'){
			return (
				<TouchableOpacity onPress={this.onPressButton}>
				 	<View style={styles.containerItem}>
				 		<Icon name="ios-contact-outline" size={48} />
				        <View style={styles.itemBody}>
				          <Text>{item.name}</Text>
				        </View>
				        <Icon name="ios-arrow-forward" size={24} style={{top:16}}/>
				    </View>
				</TouchableOpacity>
			);
		}


		return (
				<TouchableOpacity onPress={item.onClick} item={item} navigator={navigator}>
				 	<View style={styles.containerItem}>
				 		<Icon name={item.icon} size={36} />
				        <View style={styles.itemBody}>
				          <Text>{item.name}</Text>
				        </View>
				        <Icon name="ios-arrow-forward" size={24} style={{top:16}}/>
				    </View>
				</TouchableOpacity>
		);
	}

    renderSectionHeader(sectionData, sectionID){
		//console.log('sectionID', sectionID);
		if(sectionID === 'account'){
		    return (
		      <View
		        key={`${sectionID}`}
		        style={{
		          borderBottomWidth:1,
		        }}
		      />
		    );
		}

	    return (
	      <View
	        key={`${sectionID}`}
	        style={{
	          height: 20,
	          borderBottomWidth:1,
	          borderTopWidth:1,
	        }}
	      />
	    );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    	return (
			<View
				key={`${sectionID}-${rowID}`}
				style={{
				  height: 1,
				  backgroundColor: 'gray',
				}}
			/>
		);
    }

	render() {
		const { auth } = this.props;
		let title = auth.user ? auth.user.name : '个人';
		let titleConfig = {
			title: title
		};

		let rows;
		if ( auth.user ){
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
			<View style={{flex:1}}>
				<NavigationBar
					title={titleConfig}
				/>
				<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
					renderRow={this.renderItem}
					renderSectionHeader = {this.renderSectionHeader}
					renderSeparator = {this.renderSeparator}
					removeClippedSubviews = {false}
				/>
			</View>
		);
  	}

}


const styles = StyleSheet.create({
  containerItem:{
    flex:1,
    flexDirection:'row',
    //borderBottomWidth:1,
    //borderTopWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  itemHeader:{
    width:48,
    height:48
  },
  itemBody:{
    width:280,
    top:16
  },
  itemFooter:{
    color:'blue',
    paddingTop: 18
  }
});


export default AuthPage;