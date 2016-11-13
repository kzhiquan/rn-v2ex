import React from 'react';
import { View, Text,TouchableHighlight,StyleSheet,ActivityIndicator } from 'react-native'

import NavigationBar from 'react-native-navbar';

import { login,getLoginWillPostForm }  from '../utils/SiteUtil'



var t = require('tcomb-form-native');
var Form = t.form.Form;
var LoginFrom = t.struct({
	name: t.String,
	password: t.String
});
var options = {
	fields:{
		password:{
			secureTextEntry:true
		}
	}
}

class AddAccountPage extends React.Component {
	constructor(props){
		//console.log("AddAcount constructor");
		super(props);
		this.onPress = this.onPress.bind(this);
	}

	componentWillReceiveProps(nextProps){
		//console.log('this.props', this.props, 'nextProps:', nextProps);
	}

	componentWillMount(){
		//console.log("componentWillMount");
		const { accountActions } = this.props;
		accountActions.addAccountPageInit();
	}

	componentDidMount(){
		//console.log('componentDidMount');
	}

	componentDidUpdate(){
		//console.log('componentDidUpdate');
		const { navigator, account } = this.props;
		if( account.user && account.checkAccount.name === account.user.name){
			navigator.pop();
		}
	}

	onPress(){
		const { navigator, accountActions } = this.props;
		//console.log('this.props', this.props);
		var value = this.refs.form.getValue();
		if (value) {
		   console.log(value);
		   accountActions.accountAdd(value.name, value.password);
		}
	}

	render() {
		const { navigator, account } = this.props;
		var leftButtonConfig = {
			title: 'Back',
			handler: function onBack() {
			  navigator.pop();
			}
		};

		var titleConfig = {
			title: 'Add Account',
		};

		//console.log('render addAccount', account);

		return (
			<View>
				<NavigationBar
        			title={titleConfig}
        			leftButton={leftButtonConfig}/>

				<View style={styles.container}>
					<Form
					  ref="form"
					  type={LoginFrom}
					  value={account.checkAccount}
					  options={options}
					/>
					<TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
					  <Text style={styles.buttonText}>Save</Text>
					</TouchableHighlight>

				</View>

				<ActivityIndicator
			        animating={account.isChecking}
			        style={{height: 80}}
			        size="large"
		        />

			</View>
		);
	}

}


var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});


export default AddAccountPage;