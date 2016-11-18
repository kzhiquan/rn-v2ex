import React from 'react';
import { View, Text,ListView,StyleSheet,TouchableOpacity } from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import { toastShort } from '../utils/ToastUtil';
import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import MyTopicListContainer from '../containers/MyTopicListContainer';
import MyReplyListContainer from '../containers/MyReplyListContainer';


class UserPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
        	dataSource: new ListView.DataSource({
        		rowHasChanged: (r1, r2) => r1 !== r2,
        		sectionHeaderHasChanged: (h1, h2) => h1 !== h2, 
        	} )
    	};
    	this.renderItem = this.renderItem.bind(this);
	}


	componentWillMount(){
		//console.log('componentWillMount');
	}

	componentDidMount(){
		//console.log('componentDidMount');
		const { userActions } = this.props;
		userActions.requestUser('/member/xdazz');
	}


	renderItem(item, sectionID, rowID, highlightRow){
		//console.log(item, sectionID, rowID);
		return null;
	}

    renderSectionHeader(sectionData, sectionID){
		//console.log('sectionID', sectionID);
		return null;
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    	return null;
    }

	render() {
		const { user } = this.props;
		let titleConfig = {
			title: '个人'
		};

		let rows = {};

		console.log('user', user, this.props);

		return (
			<View style={{flex:1}}>
				<NavigationBar
					title={titleConfig}
				/>

				{
		          	user.isLoading ? 
		          	<LoadingView /> : 
					<ListView
						initialListSize = {5}
						dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
						renderRow={this.renderItem}
						renderSectionHeader = {this.renderSectionHeader}
						renderSeparator = {this.renderSeparator}
						removeClippedSubviews = {false}
					/>
        		}

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


export default UserPage;