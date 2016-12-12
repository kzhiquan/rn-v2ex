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

	_renderItem(item, sectionID, rowID, highlightRow){
		const { navigator } = this.props;
		return (
			<TouchableOpacity onPress={this._onItemPress} node={item} navigator={navigator}>
				<View style={{flex:1, flexDirection:'row', borderBottomWidth:1}}>
					<Image style={{width:48, height:48}} source={{uri:item.img_url}} />
					<View style={{marginTop:15}}>
						<Text>{item.name}</Text>
					</View>
					<View style={{marginTop:15, marginRight:30}}>
						<Text>{item.topic_count}</Text>
					</View>			
				</View>
			</TouchableOpacity>

		);
	}	


	render() {
		const { navigator, auth } = this.props;
		var leftButtonConfig = {
	      title: 'Back',
	      handler: function onBack() {
	        navigator.pop();
	      }
	    };

	    var titleConfig = {
	      title: '我的节点',
	    };

		let rows = [];
		if(auth.myNode.nodeList){
			rows = auth.myNode.nodeList;
		}

		return (
			<View style={{flex:1}}>
	          <NavigationBar
	              title={titleConfig}
	              leftButton={leftButtonConfig}/>

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


const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  containerItem:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  itemHeader:{
    width:48,
    height:48
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


export default MyNodeListPage;




