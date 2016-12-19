

import React from 'react';
import { 
	View, 
	Text, 
	Image,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
} from 'react-native';

import AddAccountContainer from '../containers/AddAccountContainer';

class LoginPage extends React.Component{

	constructor(props){
		super(props);
	}

	_onLoginButton(){
		const { navigator } = this.props;
		//console.log('navigator', navigator);
		navigator.push({
			component : AddAccountContainer,
			name : 'AddAccountPage',
		})
	}

	render(){
		return (
			<View style={styles.container}>

				<View style={styles.loginContainer}>
					<Image
        				source={require('../static/imgs/logo.png')}
      				/>
      				<Text style={styles.loginLogoText}>V2EX</Text>
					
				</View>

				<TouchableOpacity 
					onPress={this._onLoginButton.bind(this)} 
					style={styles.loginButton}>
					<Text style={styles.loginButtonText}>登录</Text>
		    	</TouchableOpacity>


			</View>
		)
	}
}


const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
	container : {
		flex : 1,
		flexDirection :'column',
		alignItems : 'center',
		backgroundColor : '#ffffff',
	},

	loginContainer : {
		marginTop: height*0.18,
		alignItems: 'center',
	},

	loginLogoText : {
		marginTop : 16,
		fontSize : 24,
		//fontWeight : 'bold',
	},

	loginButton:{
		marginTop : height*0.274,
		borderWidth : 1,
		borderColor : '#2AAAFF',
		paddingTop:7,
		paddingBottom:7,
		paddingLeft : 13,
		paddingRight : 13,
		borderRadius : 8,
	},

	loginButtonText:{
		fontSize : 20, 
		color : '#2AAAFF',
		fontWeight:'bold',
	}
});

export default LoginPage;