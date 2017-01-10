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
	Alert,
} from 'react-native'

import NavigationBar from 'react-native-navbar';
import NewTopicContentPage from './NewTopicContentPage';


class NewTopicTitlePage extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	text:'',
	    	placeholder : '请输入主题标题', 
	    	height : 0,
	    }
  	}

	_onNextStep(){
		const { navigator } = this.props;
		if(this.state.text == ''){

			Alert.alert('标题为空');

		}else{
			navigator.push({
				component : NewTopicContentPage,
				name :'NewTopicContentPage',
				newTopicTitle : this.state.text,
			});
		}
	}

	_onCancel(){
		const { navigator } = this.props;
		navigator.pop();
	}


	render() {
		const { navigator } = this.props;

		let leftButtonConfig = {
			title: '取消',
			handler: function onBack() {
			  navigator.pop();
			}
		}

		let rightButtonConfig = {
			title: '下一步',
			handler : this._onNextStep.bind(this),		
		}

		let titleConfig = {
			title: '创建新主题',
		}

		return (
			<View style={styles.container}>

	       		<NavigationBar
					style={styles.navigatorBarStyle}
        			title={titleConfig}
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

export default NewTopicTitlePage;






