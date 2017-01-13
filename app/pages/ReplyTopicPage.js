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
	Dimensions,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';


class ReplyTopicPage extends React.Component {

	constructor(props) {
	    super(props);
	    const { route } = this.props;
	    let initText = '';
	    if (route.reply){
	    	initText = '@' + route.reply.member_name + ' ';
	    }

	    this.state = {
	    	text:initText,
	    	placeholder : '请输入你的回复!', 
	    	height : 0,
	    }
  	}

	_onPublish(){
		const { navigator, route } = this.props;
		const { topicActions, wrapList } = route;
		console.log('route', route);
		//topicActions.startReplyTopic('/t/'+topic.topic_id, topic.reply_once, this.state.text);
		topicActions.startReplyTopic(wrapList, this.state.text);
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

		let rightButtonConfig = {
			title: '发布',
			handler: this._onPublish.bind(this),
		};

		return (
			<View style={styles.container}>

	        	<NavigationBar
	              title={titleConfig}
	              style={styles.navigatorBarStyle}
	              leftButton={leftButtonConfig}
	              rightButton={rightButtonConfig}
	              statusBar={{
			        tintColor : '#FAFAFA'
			      }}
	       		/>

	       		<View style={styles.textInputContainer}>
	       			<TextInput
	       				style={{
	       					height: Math.max(35, this.state.height),
	       					width:width-16-16,
	       					fontSize:16,
	       				}}
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

const {height, width} = Dimensions.get('window');

var styles = StyleSheet.create({
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
		paddingTop:12,
		paddingLeft:16
	}
});

export default ReplyTopicPage;




