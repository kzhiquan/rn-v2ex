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
	Alert,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import TopicContainer from '../../containers/public/TopicContainer';
import NameTableItem from '../../components/NameTableItem';


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
		if(!this.state.selectedNodes || this.state.selectedNodes.length == 0){
			Alert.alert('话题为空');
		}else{
			newTopicActions.postNewTopic(route.newTopicTitle, route.newTopicContent, this.state.selectedNodes[0].value, newTopic.once);
		}
	}

	_onBackClick(){
		const { navigator } = this.props;
		navigator.pop();
	}

	_onItemClick(item){
		this.state.selectedNodes.shift();
		this.state.selectedNodes.push(item);
		this.setState({selectedNodes:this.state.selectedNodes})
	}

	_renderItem(item, sectionID, rowID, highlightRow){
		return (
			<NameTableItem
				name={item.name}
				onClick={()=>this._onItemClick(item)}
			/>
		)
	}	

	_onSearchTextChange(text){
	    this.setState({text: text});
  	}

  	_onKeyPress(e){
  		//console.log(e.nativeEvent.key, 'text', this.state.text, this.state.text == '');
  		if(e.nativeEvent.key == 'Backspace' && this.state.text == ''){
  			this.state.selectedNodes.shift();
  			this.setState({selectedNodes:this.state.selectedNodes});
  		}
  	}

  	_renderSelectedNode(item, index){
		return (
			<View 
			  key={`node-${index}`} 
			  style={styles.selectedNodeStyle}>
				<Text style={styles.metaTextStyle}>{item.name}</Text>
			</View>
		)
  	}

  	_renderTextInputBar(){
  		return (
       		<View style={styles.textInputBarOutContainer}>

       			<View style={styles.textInputBarContainer}>
	       			<Image 
			          style={{top:4}}
	          		  source={require('../../static/imgs/search_gray.png')}
	          		/>

	       			{this.state.selectedNodes.map((item, index) => this._renderSelectedNode(item, index))}

       				<TextInput
	       				style={styles.textInputStyle}
	       				autoFocus={true}
	       				onChangeText={this._onSearchTextChange.bind(this)}
	       				onKeyPress={this._onKeyPress.bind(this)}
	       				value={this.state.text}
	       				placeholder={this.state.placeholder} 
   					/>

       			</View>


       		</View>
  		)
  	}

	render() {
		const { navigator, newTopic } = this.props;

		//console.log('this.props', this.props);
		let rightButtonConfig = {
			title: '发布',
			handler: this._onPublish.bind(this),
		};

		let titleConfig ={
			title: '请选择一个话题',
		}

		let rows = [];
		if(newTopic.nodes){
			for( let [name, value] of Object.entries(newTopic.nodes) ){
				let pattern = new RegExp(this.state.text, 'i')
				if( pattern.test(name) ){
					rows.push({name, value});
				}
			}
		}

		return (
			<View style={styles.container}>

	       		<NavigationBar
					style={styles.navigatorBarStyle}
					title={titleConfig}
					leftButton={
						<TouchableOpacity onPress={this._onBackClick.bind(this)}>
                			<Image style={{left:12, top:11}} source={require('../../static/imgs/back_arrow.png')}/>
              			</TouchableOpacity> 
					}
					rightButton={rightButtonConfig}
					statusBar={{
			            tintColor : '#FAFAFA'
			        }}
				/>

				{this._renderTextInputBar()}

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

const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';

const styles = StyleSheet.create({

	container : {
		flex : 1,
		backgroundColor : 'white',
	},
	navigatorBarStyle:{
		backgroundColor : '#FAFAFA', 
		borderBottomWidth : 1,
		borderBottomColor : '#B2B2B2',
	},

	textInputContainer:{
		flexDirection:'row', 
	},

	textInputStyle:{
		left:8,
		flex:1,
		alignSelf:'stretch',
		height:24,
		fontSize:16,
	},

	selectedNodeStyle:{
		left:8,
		marginRight:8,
	    backgroundColor:'#F2F2F2', 
	    borderRadius:3, 
	    paddingTop:2,
	    paddingLeft:2,
	    paddingRight:2,
		alignSelf:'stretch',
    },

    metaTextStyle:{
    	fontSize:14, 
    	color:'#A0ADB8',
  	},

  	textInputBarContainer:{
  		flexDirection:'row', 
		justifyContent:'flex-start',
		flexWrap:'wrap',
		width:width-16-12,
  	},

	textInputBarOutContainer:{
		paddingTop:12,
		left:16,
		paddingBottom:4, 
    	borderBottomWidth : 1, 
    	borderBottomColor : borderColor,
	},

	front:{
		position: 'absolute',
		top:300,
		left: (width-50)/2,
		width: 50,
		height:50,
		zIndex: 1,
	},

});


export default NewTopicNodePage;




