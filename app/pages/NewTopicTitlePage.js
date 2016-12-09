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
import NewTopicContentPage from './NewTopicContentPage';


class NewTopicTitlePage extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	text:'',
	    	placeholder : '请输入主题标题, 如果标题能够表达完整内容, 则正文可以为空', 
	    	height : 0,
	    }
  	}

  	componentDidMount(){

	}


	_onNewPostNextStep(){
		//console.log('newPostNextStep');
		const { navigator } = this.props;
		navigator.push({
			component : NewTopicContentPage,
			name :'NewTopicContentPage',
			newTopicTitle : this.state.text,
		});
	}

	_onCancel(){
		const { navigator } = this.props;
		navigator.pop();
	}


	render() {
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
	                  <Icon name="ios-close" size={40} style={{marginLeft:10}} color="blue"/>
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


export default NewTopicTitlePage;




