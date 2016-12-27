import React from 'react';
import { 
	View, 
	Text,
	ListView,
	StyleSheet,
	Image, 
	TouchableOpacity, 
	ActivityIndicator,
	TextInput,
	RecyclerViewBackedScrollView,
	Dimensions,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import NodeTopicListContainer from '../containers/NodeTopicListContainer';



class MyNodeListPage extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	dataSource: new ListView.DataSource({
		        rowHasChanged: (r1, r2) => r1 !== r2,  
		    }),
	    }
  	}

  	componentDidMount(){
	    const { authActions, auth } = this.props;
	    authActions.requestMyNode();
	}


	_onItemPress(){
		const { node, navigator } = this;
		navigator.push({
	      component: NodeTopicListContainer,
	      name : node.name,
	      node: node,
		});
	}

	_onBackClick(){
	    const { navigator } = this.props;
	    navigator.pop();
  	}

	_renderItem(item, sectionID, rowID, highlightRow){
		const { navigator } = this.props;
		let nodeItemContainer = styles.nodeItemContainer;
		if(rowID == 0){
			nodeItemContainer = [nodeItemContainer, {top:4}];
		}
		return (
			<TouchableOpacity onPress={this._onItemPress} node={item} navigator={navigator}>
				<View style={nodeItemContainer}>
					<Image 
						style={styles.avatar_size_42} 
						source={{uri:item.img_url}} />
					<View style={[styles.avatarRightContent, {flexDirection:'row', justifyContent:'space-between', paddingTop:12}]}>
						<View>
							<Text style={{fontSize:16}}>{item.name}</Text>
						</View>
						<View style={styles.directionRow}>
							<Text style={styles.metaTextStyle}>{item.topic_count}</Text>
							<Image 
								style={{left:8}}
								source={require('../static/imgs/arrow.png')}
							/>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}	

	render() {
		const { navigator, auth } = this.props;

	    var titleConfig = {
	      title: '节点收藏',
	    };

		let rows = [];
		if(auth.myNode.nodeList){
			rows = auth.myNode.nodeList;
		}

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
	              renderRow={this._renderItem.bind(this)}
	              enableEmptySections={true}
	              removeClippedSubviews = {false}
	              keyboardShouldPersistTaps = {true}
	              renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
	            />
	            <ActivityIndicator
		          animating={ auth.myNode.isLoading }
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
let backgroundColor = 'white';

const styles = StyleSheet.create({

  //common
  directionRow:{
    flexDirection : 'row',
  },

  avatar_size_42:{
    width:42,
    height:42,
    borderRadius:21,
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

  container : {
    flex : 1,
    backgroundColor : backgroundColor,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42-10,
  },

  nodeItemContainer : {
  	flexDirection : 'row',
    flex : 1, 
    paddingTop:8, 
    left:16, 
    paddingBottom:10, 
    height:60,
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
  },

});


export default MyNodeListPage;




