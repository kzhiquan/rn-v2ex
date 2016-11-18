

import React from 'react';
import { View, StatusBar, Navigator } from 'react-native';

import Main from './Main.js';
import AccountContainer from './AccountContainer';
import MyTopicListContainer from './MyTopicListContainer';
import NodeListContainer from './NodeListContainer';
import UserContainer from './UserContainer';
import TestPage from '../pages/TestPage';


class App extends React.Component{

	constructor(props){
		super(props);
		this.renderScene = this.renderScene.bind(this);
	}

	renderScene(route, navigator){
		const Component = route.component;
		return (
			<Component  navigator={navigator} route={route}  />
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
						//component : AccountContainer,
						//component : MyTopicContainer,
						//component: TestPage,
						//component : NodeListContainer,
						component : UserContainer,
						name : 'Topic'
					}}
				/>
			</View>
		);
	}
}




export default App;