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
import NewTopicNodeContainer from '../../containers/home/NewTopicNodeContainer';


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


	_onNextStep(){
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

	_onBackClick(){
		const { navigator } = this.props;
		navigator.pop();
	}


	render() {
		const { navigator } = this.props;

		let rightButtonConfig = {
			title: '下一步',
			handler: this._onNextStep.bind(this),
		};

		let titleConfig = {
			title: '创建新主题',
		};

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

export default NewTopicContentPage;




