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

import TopicContainer from '../containers/TopicContainer';


class NewTopicNodePage extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	dataSource: new ListView.DataSource({
		        rowHasChanged: (r1, r2) => r1 !== r2,  
		    }),
	    	text:'',
	    	placeholder : '搜索话题', 
	    	selectedNodes : [],
	    }
  	}

  	componentDidMount(){
  		const { newTopicActions } = this.props;
  		newTopicActions.requestNewTopic();
	}

	componentWillReceiveProps(nextProps){
  		const { newTopic, navigator } = nextProps;
  		//console.log('componentWillReceiveProps', newTopic);
  		if(newTopic.topic_url){
  			//console.log(navigator.getCurrentRoutes());
  			let oldRoutes = navigator.getCurrentRoutes();
  			let limit = oldRoutes.length - 3;
  			let newRoutes = oldRoutes.filter( (elem, index) => {
  				return index < limit;
  			})

  			//console.log(newRoutes);
  			newRoutes.push({
  				component : TopicContainer,
  				name : 'Topic',
      			topic : {
      				topic_url : newTopic.topic_url,
      			}
  			});
  			navigator.immediatelyResetRouteStack(newRoutes);
  			//console.log(navigator.getCurrentRoutes());

  			/*setTimeout(function(){
  				navigator.push({
	  				component : TopicContainer,
	  				name : 'Topic',
	      			topic : {
	      				topic_url : newTopic.topic_url,
	      			}
  				});
  			}, 1000);*/

  			/*navigator.popN(3);

  			navigator.push({
  				component : TopicContainer,
  				name : 'Topic',
      			topic : {
      				topic_url : newTopic.topic_url,
      			}
  			});*/

  		}
	}


	_onPublish(){
		//console.log('onPublish');
		const { navigator, route, newTopic, newTopicActions } = this.props;
		//console.log(route, newTopic, this.state.selectedNodes);
		newTopicActions.postNewTopic(route.newTopicTitle, route.newTopicContent, this.state.selectedNodes[0].value, newTopic.once);
	}

	_onCancel(){
		const { navigator } = this.props;
		navigator.pop();
	}

	_onItemPress(){
		const { item, that } = this;
		//console.log(that.state.selectedNodes);
		that.state.selectedNodes.push(item);
		that.setState({selectedNodes:that.state.selectedNodes})
	}

	_renderItem(item, sectionID, rowID, highlightRow){
		return (
			<TouchableOpacity onPress={this._onItemPress} item={item} that={this}>
				<View style={styles.containerItem}>
					<Text>{item.name}</Text>
				</View>
			</TouchableOpacity>
		);
	}	

	_searchTextChange(text){
	    this.setState({text: text});
  	}


	render() {
		const { navigator, newTopic } = this.props;

		//console.log('this.props', this.props);

		let rightButtonConfig = {
			title: '发布',
			handler: this._onPublish.bind(this),
		};

		let rows = [];
		if(newTopic.nodes){
			for( let [name, value] of Object.entries(newTopic.nodes) ){
				let pattern = new RegExp(this.state.text, 'i')
				if( pattern.test(name) ){
					rows.push({name, value});
				}
			}
		}

		//<View style={{borderWidth:1,padding:10}}><Text>iMac</Text></View>
	    //<View style={{borderWidth:1,padding:10}}><Text>Flask</Text></View>
		return (
			<View style={{flex:1}}>
	        	<NavigationBar
	              rightButton={rightButtonConfig}
	              leftButton={
	                <TouchableOpacity onPress={this._onCancel.bind(this)}>
	                  <Icon name="ios-arrow-back" size={40} style={{marginLeft:10}} color="blue"/>
	                </TouchableOpacity> 
	              }
	       		/>
	       		<View style={{flexDirection:'row', justifyContent:'flex-start',flexWrap:'wrap',}}>
	       			{
	       				this.state.selectedNodes.map((item, index) => {
	       					return (
	       						<View key={`node-${index}`} style={{borderWidth:1,padding:10,height:40,alignSelf:'stretch'}}><Text>{item.name}</Text></View>
	       					)
	       				})
	       			}
	       			<TextInput
	       				style={{flex:1,height:40, borderWidth:1, alignSelf:'stretch'}}
	       				autoFocus={true}
	       				onChangeText={this._searchTextChange.bind(this)}
	       				value={this.state.text}
	       				placeholder={this.state.placeholder} 
       				/>
	       		</View>

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
		          animating={ newTopic.isLoading }
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


export default NewTopicNodePage;




