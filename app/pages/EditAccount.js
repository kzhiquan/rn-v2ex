import React from 'react';
import { View, Text,TouchableHighlight,StyleSheet,ActivityIndicator } from 'react-native'

import NavigationBar from 'react-native-navbar';


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

class EditAccount extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			removeBtnShow:true,
			updateBtnShow:true
		}
		const { account } = props;
		this.presentAccount = account.editAccount;
		this.onSavePress = this.onSavePress.bind(this);
		this.onRemovePress = this.onRemovePress.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentDidUpdate(){
		//console.log('componentDidUpdate');
		const { navigator, account } = this.props;
		if( account.user && account.checkAccount.name === account.user.name){
			//navigator.pop();
		}
	}

	onSavePress(){
		const { navigator, accountActions } = this.props;
		var value = this.refs.form.getValue();
		if (value){
		  accountActions.accountAdd(value.name, value.password);
		  navigator.pop();
		}
	}

	onRemovePress(){
		const { navigator, accountActions } = this.props;
		var value = this.refs.form.getValue();
		if (value){
		  accountActions.accountDelete(value.name, value.password);
		  navigator.pop();
		}
	}

	onChange(value){
		const { account } = this.props;
		//console.log('value', value, currentAccount, account);
		this.presentAccount = value;
		if(value.name !== account.editAccount.name){
			this.setState({removeBtnShow:false});
			if (account.accounts.has(value.name)){
				this.setState({updateBtnShow:true});
			}else{
				this.setState({updateBtnShow:false});
			}
		}else{
			this.setState({removeBtnShow:true, updateBtnShow:true});
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
			title: 'Edit Account',
		};

		//console.log('this.presentAccount:', this.presentAccount);
		return (
			<View>
				<NavigationBar
        			title={titleConfig}
        			leftButton={leftButtonConfig}/>

				<View style={styles.container}>
					<Form
					  ref="form"
					  type={LoginFrom}
					  value={this.presentAccount}
					  onChange={this.onChange}
					  options={options}
					/>

					<TouchableHighlight style={styles.button} onPress={this.onSavePress} underlayColor='#99d9f4'>
					  <Text style={styles.buttonText}>{this.state.updateBtnShow ? 'Update' : 'Save'}</Text>
					</TouchableHighlight>

					{this.state.removeBtnShow && (<TouchableHighlight ref="remove" style={styles.button} onPress={this.onRemovePress} underlayColor='#99d9f4'>
				  		<Text style={styles.buttonText}>Remove</Text>
					</TouchableHighlight>)}

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

export default EditAccount;


