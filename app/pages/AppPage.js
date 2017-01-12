

import React from 'react';
import { 
	View, 
	StatusBar,
	Navigator 
} from 'react-native';

import MainPage from './MainPage';
import MainContainer from '../containers/MainContainer'
import AccountContainer from '../containers/auth/AccountContainer';
import MyTopicListContainer from '../containers/auth/MyTopicListContainer';
import NodeListContainer from '../containers/NodeListContainer';
import UserContainer from '../containers/public/UserContainer';
import NodeTopicListContainer from '../containers/NodeTopicListContainer';

import LoginContainer from '../containers/auth/LoginContainer';


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
		console.log('route', route, routeStack);
		switch(route.name){
			case 'ReplyTopicPage' :
				return Navigator.SceneConfigs.FloatFromBottom;
			case 'TopicDialogPage' : 
				return Navigator.SceneConfigs.FloatFromBottom;
			default:
				return Navigator.SceneConfigs.FloatFromRight;
		}
	}

	_renderLoginPage(){
		return <LoginContainer />
	}

	render(){
		const { auth } = this.props;
		//console.log('auth', auth);
		//auth.user = null;
		let currentComponent;
		if( auth.user == null ){
			currentComponent = LoginContainer;
		}else{
			//currentComponent = MainPage;
			currentComponent = MainContainer;
		}

		return (
			<View style={{flex : 1}}>
				<Navigator
					style={{flex : 1}}
					renderScene={this.renderScene.bind(this)}
					configureScene={this.configureScene.bind(this)}
					initialRoute={{
						component : currentComponent,
						//component : AccountContainer,
						//component : MyTopicContainer,
						//component: TestPage,
						//component : NodeListContainer,
						//component : UserContainer,
						/*component : NodeTopicListContainer,
						name : 'RecentTopic', 
						node : {
							name : '最近主题',
							path : '/recent',
						}*/
					}}
				/>
			</View>
		);
	}
}


export default App;