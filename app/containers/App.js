

import React from 'react';
import { 
	View, 
	StatusBar,
	Navigator 
} from 'react-native';

import Main from './Main.js';
import AccountContainer from './AccountContainer';
import MyTopicListContainer from './MyTopicListContainer';
import NodeListContainer from './NodeListContainer';
import UserContainer from './UserContainer';
import NodeTopicListContainer from './NodeTopicListContainer';
import TestPage from '../pages/TestPage';


class App extends React.Component{

	constructor(props){
		super(props);
	}

	renderScene(route, navigator){
		const Component = route.component;
		return (
			<Component  navigator={navigator} route={route}  />
		);
	}

	configureScene(route, routeStack){
		switch(route.name){
			case 'ReplyTopicPage' :
				return Navigator.SceneConfigs.FloatFromBottom;
			case 'TopicDialogPage' : 
				return Navigator.SceneConfigs.FloatFromBottom;
			default:
				return Navigator.SceneConfigs.FloatFromRight;
		}
	}

	render(){
		return (
			<View style={{flex : 1}}>
				<Navigator
					style={{flex : 1}}
					renderScene={this.renderScene.bind(this)}
					configureScene={this.configureScene.bind(this)}
					initialRoute={{
						//component : Main,
						//component : AccountContainer,
						//component : MyTopicContainer,
						//component: TestPage,
						//component : NodeListContainer,
						//component : UserContainer,
						component : NodeTopicListContainer,
						name : 'RecentTopic', 
						node : {
							name : '最近主题',
							path : '/recent',
						}
					}}
				/>
			</View>
		);
	}
}


export default App;