

import React from 'react';
import { View, StatusBar, Navigator } from 'react-native';

import Main from './Main.js';


class App extends React.Component{

	constructor(props){
		console.log('constructor');
		super(props);
		this.renderScene = this.renderScene.bind(this);
	}

	renderScene(route, navigator){
		console.log('route:', route, navigator);
		const Component = route.component;
		return (
			<Component navigator={navigator} route={route} />
		);
	}

	render(){
		return (
			<View style={{flex : 1}}>
				<StatusBar backgroundColor="blue" barStyle="dark-content"/>
				<Navigator
					style={{flex : 1, marginTop : 20 }}
					renderScene={this.renderScene}
					initialRoute={{
						component : Main,
						name : 'Topic'
					}}
				/>
			</View>
		);
	}
}




export default App;