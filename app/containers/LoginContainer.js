import React from 'react';
import { View, Text,TouchableHighlight,StyleSheet } from 'react-native'

import NavigationBar from 'react-native-navbar';
import qs from 'qs'

import { getLoginWillPostForm }  from '../utils/SiteUtil'



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

class LoginContainer extends React.Component {
	constructor(props){
		super(props);
		this.onPress = this.onPress.bind(this);
	}

	onPress(){
		// call getValue() to get the values of the form
		var value = this.refs.form.getValue();
		if (value) { // if validation fails, value will be null
		  console.log(value); // value here is an instance of Person

		  getLoginWillPostForm('kzhiquan', 'kzhiquan62286507')
		  .then(function(postForm){
		  	console.log(postForm);
		  	console.log(qs.stringify(postForm));

			fetch('https://www.v2ex.com/signin', {
				method : 'post',
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36',
        			'Host': 'www.v2ex.com',
        			'Referer': 'https://www.v2ex.com/signin',
        			'Origin': 'https://www.v2ex.com'
				},
				credentials: 'include',
				body: qs.stringify(postForm)
			})
			.then((response) => {
				console.log(response, response.headers);
				return response.text();
			})
			.then((body) => {
				console.log('body', body);
			})
			.catch((error) => {
				console.error('error', error);
			})
		  });

		}
	}

	render() {
		const { navigator } = this.props;
		var leftButtonConfig = {
			title: 'Back',
			handler: function onBack() {
			  //alert('hello!');
			  navigator.pop();
			}
		};

		var titleConfig = {
			title: 'Add Account',
		};

		return (
			<View>
				<NavigationBar
        			title={titleConfig}
        			leftButton={leftButtonConfig}/>

				<View style={styles.container}>
					{/* display */}
					<Form
					  ref="form"
					  type={LoginFrom}
					  options={options}
					/>
					<TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
					  <Text style={styles.buttonText}>Save</Text>
					</TouchableHighlight>
				</View>
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


export default LoginContainer;