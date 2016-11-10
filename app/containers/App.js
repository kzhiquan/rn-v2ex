

import React from 'react';
import { View, StatusBar, Navigator } from 'react-native';

import Main from './Main.js';
import LoginContainer from './LoginContainer';
import AccountContainer from './AccountContainer';


class App extends React.Component{

	constructor(props){
		super(props);
		this.renderScene = this.renderScene.bind(this);
	}

	renderScene(route, navigator){
		const Component = route.component;
		//const props = Object.assign({}, route.props);
		return (
			<Component  /*{...props}*/ navigator={navigator} route={route}  />
		);
	}

	render(){
		return (
			<View style={{flex : 1}}>
				<Navigator
					style={{flex : 1}}
					renderScene={this.renderScene}
					initialRoute={{
						//component : Main,
						component : AccountContainer,
						name : 'Topic'
					}}
				/>
			</View>
		);
	}
}




export default App;