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


class ReplyTopicPage extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	text:'',
	    	placeholder : '请输入你的回复!', 
	    	height : 0,
	    }
  	}

  	componentDidMount(){

	}

	_onPublish(){
		const { navigator, route } = this.props;
		console.log('route', route);
		route.topicActions.startReplyTopic('/t/'+route.topic.topic.topic_id, route.topic.topic.reply_once, this.state.text);
		navigator.pop(); 
	}


	render() {
		const { navigator } = this.props;
		let titleConfig = {
			title: '回复',
		};
		let leftButtonConfig = {
			title: '取消',
			handler: function onBack() {
			  navigator.pop();
			}
		};

		return (
			<View style={{flex:1}}>
	        	<NavigationBar
	              title={titleConfig}
	              leftButton={leftButtonConfig}
	              rightButton={
	                <TouchableOpacity onPress={this._onPublish.bind(this)}>
	                  <Icon name="ios-send" size={30} style={{marginRight:10, marginTop:10}} color="blue"/>
	                </TouchableOpacity> 
	              }
	       		/>
	       		<View>
	       			<TextInput
	       				style={{height: Math.max(35, this.state.height)}}
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


export default ReplyTopicPage;




