import React from 'react';
import { 
	View, 
	StatusBar,
	Navigator,
	StyleSheet,
	ScrollView,
	Text 
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import Tarbar from '../components/TabBar';
import TopicListContainer from '../containers/TopicListContainer';
import NodeListContainer from '../containers/NodeListContainer';


import AuthContainer from '../containers/auth/AuthContainer';
import NotificationPage from './notification/NotificationPage';
import FindPage from './find/FindPage';
import HomePage from './home/HomePage';
import HomeContainer from '../containers/home/HomeContainer';


class MainPage extends React.Component{

	_onChangeTab(transition){
		console.log('transition', transition);
		if(transition.i == 3){
			const{ authActions, auth } = this.props;
			authActions.requestUserMeta(auth.user);
		}
	}

	render(){
		return (
			<ScrollableTabView
				locked={true}
	      		initialPage={0}
	      		tabBarPosition="bottom"
	      		scrollWithoutAnimation={true}
	      		onChangeTab={this._onChangeTab.bind(this)}
	      		renderTabBar={() => <Tarbar />}
	      		>

			      <HomeContainer tabLabel="ios-home-outline" {...this.props}>
			      </HomeContainer>

			      <FindPage tabLabel="ios-compass-outline" {...this.props}>
			      </FindPage>

			      <NotificationPage tabLabel="ios-notifications-outline" {...this.props}>
			      </NotificationPage>

			      <AuthContainer tabLabel="ios-person-outline" {...this.props}>
			      </AuthContainer>

	    	</ScrollableTabView>
	    );
	}
}




export default MainPage;