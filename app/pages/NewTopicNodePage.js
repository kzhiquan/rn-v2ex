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


class NewTopicNodePage extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	dataSource: new ListView.DataSource({
		        rowHasChanged: (r1, r2) => r1 !== r2,  
		    }),
	    	text:'',
	    	placeholder : '搜索话题', 
	    }
  	}

  	componentDidMount(){

	}


	_onPublish(){
		console.log('onPublish');
		
	}

	_onCancel(){
		const { navigator } = this.props;
		navigator.pop();
	}

	_renderItem(){
		return null;
	}


	render() {
		const { navigator } = this.props;

		console.log('this.props', this.props);

		let rightButtonConfig = {
			title: '发布',
			handler: this._onPublish.bind(this),
		};

		let rows = [];

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
       			<TextInput
       				autoFocus={true}
       				onChangeText={(text) => this.setState({text})}
       				value={this.state.text}
       				placeholder={this.state.placeholder} 
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
			</View>
		);
	}
}


export default NewTopicNodePage;




