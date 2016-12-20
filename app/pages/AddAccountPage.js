import React from 'react';
import { 
	View, 
	Text,
	TouchableHighlight,
	StyleSheet,
	ActivityIndicator,
	Dimensions,
	Alert, 
} from 'react-native'

import NavigationBar from 'react-native-navbar';


import MainPage from './MainPage';

var t = require('tcomb-form-native');
t.form.Form.stylesheet.textbox.normal.backgroundColor = '#ffffff';
t.form.Form.stylesheet.textbox.normal.borderRadius = 0;
t.form.Form.stylesheet.textbox.normal.borderLeftWidth = 0;
t.form.Form.stylesheet.textbox.normal.borderRightWidth = 0;
t.form.Form.stylesheet.textbox.normal.height = 44;

t.form.Form.stylesheet.textbox.error.backgroundColor = '#ffffff';
t.form.Form.stylesheet.textbox.error.borderRadius = 0;
t.form.Form.stylesheet.textbox.error.borderLeftWidth = 0;
t.form.Form.stylesheet.textbox.error.borderRightWidth = 0;
t.form.Form.stylesheet.textbox.error.height = 44;

var Form = t.form.Form;
var LoginFrom = t.struct({
	name: t.String,
	password: t.String
});
var options = {
	auto: 'none',
	fields:{
		password:{
			secureTextEntry:true,
			placeholder : '密码',
		},
		name : {
			placeholder : '用户名',
			autoFocus : true,
		}
	}
}

class AddAccountPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			value : {
				name : '', 
				password : '',
			}
		}
	}

	componentWillReceiveProps(nextProps){
		const { navigator, auth } = nextProps;
		if( auth.addAccount.addSuccess ){
			//navigator.pop();
			navigator.resetTo({
				component: MainPage,
				name : 'main',
			});
		}

		//console.log('this.props', this.props, 'nextProps:', nextProps);
	}

	componentWillMount(){
		//console.log("componentWillMount");
		const { accountActions } = this.props;
		//accountActions.addAccountPageInit();
	}

	componentDidMount(){
		console.log('componentDidMount');
	}

	componentDidUpdate(){
		console.log('componentDidUpdate');
		/*const { navigator, account } = this.props;
		//console.log('AddAccountPage account', account, navigator.getCurrentRoutes(0));
		if( account.user && account.checkAccount.name === account.user.name){
			//navigator.pop(0);
		}*/
	}

	_onAddButton(){
		const { navigator, accountActions } = this.props;
		var value = this.refs.form.getValue();
		//console.log('value', value);
		if(value == null){
			Alert.alert('用户名或密码不能为空');
		}else{
			accountActions.addAccount(value.name, value.password);
		}

	}

	render() {
		const { navigator, auth } = this.props;

		let leftButtonConfig = {
			title: '取消',
			handler: function onBack() {
			  navigator.pop();
			}
		}

		let rightButtonConfig = {
			title: '确定',
			handler : this._onAddButton.bind(this)		
		}

		let titleConfig = {
			title: '添加账户',
		}

		return (
			<View style={styles.container}>
				<NavigationBar
					style={styles.navigatorBarStyle}
        			title={titleConfig}
        			leftButton={leftButtonConfig}
        			rightButton={rightButtonConfig} />

        		<View style={{marginTop:16}}>
        			<Form
					  	ref="form"
					  	value={this.state.value}
					  	onChange={(value)=>this.setState({value:value})}
					  	type={LoginFrom}
					  	options={options}
					/>
        		</View>

		        <ActivityIndicator
		          animating={ auth.addAccount.isChecking }
		          style={styles.front}
		          size="large"
		        />

			</View>
		);
	}

}

const {height, width} = Dimensions.get('window');

var styles = StyleSheet.create({
	container : {
		flex : 1,
		backgroundColor : '#EFEFF4',
	},
	navigatorBarStyle:{
		backgroundColor : '#ffffff', 
		borderBottomWidth : 1,
		borderBottomColor : '#B2B2B2',
	},

	formInputStyle:{
		backgroundColor : '#ffffff',
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


export default AddAccountPage;