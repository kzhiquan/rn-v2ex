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
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTopicNodePage from './NewTopicNodePage';
import NewTopicNodeContainer from '../containers/NewTopicNodeContainer';


class NewTopicContentPage extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	text:'',
	    	placeholder : '请填写问题相关描述信息', 
	    	height : 0,
	    }
  	}

  	componentDidMount(){

	}


	_onNewPostNextStep(){
		console.log('newPostNextStep');
		const { navigator, route } = this.props;
		navigator.push({
			//component : NewTopicNodePage,
			component : NewTopicNodeContainer,
			name : 'NewTopicNodeContainer',
			newTopicTitle : route.newTopicTitle,
			newTopicContent : this.state.text,
		});
	}

	_onCancel(){
		const { navigator } = this.props;
		navigator.pop();
	}


	render() {
		const { navigator } = this.props;

		let rightButtonConfig = {
			title: '下一步',
			handler: this._onNewPostNextStep.bind(this),
		};

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
	       		<View>
	       			<TextInput
	       				style={{height: Math.max(35, this.state.height)}}
	       				autoFocus={true}
	       				multiline={true}
	       				onChangeText={(text) => this.setState({text})}
	       				onContentSizeChange={(event) => this.setState({height: event.nativeEvent.contentSize.height})}
	       				value={this.state.text}
	       				placeholder={this.state.placeholder} 
	       			/>
	       		</View>
			</View>
		);
	}
}


export default NewTopicContentPage;




