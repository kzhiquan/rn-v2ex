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
import AccountContainer from '../containers/AccountContainer';
import AuthContainer from '../containers/AuthContainer';
import NodeListContainer from '../containers/NodeListContainer';
import MyNotificationContainer from '../containers/MyNotificationContainer';
import NotificationPage from './NotificationPage';


class MainPage extends React.Component{
	render(){
		return (
			<ScrollableTabView
				locked={true}
	      		initialPage={0}
	      		tabBarPosition="bottom"
	      		scrollWithoutAnimation={true}
	      		renderTabBar={() => <Tarbar />}
	      		>
			      <TopicListContainer tabLabel="ios-home-outline" {...this.props}>
			      </TopicListContainer>

			      <NodeListContainer tabLabel="ios-compass-outline" {...this.props}>
			      </NodeListContainer>

			      <NotificationPage tabLabel="ios-notifications-outline" {...this.props}>
			      </NotificationPage>

			      <AuthContainer tabLabel="ios-person-outline" {...this.props}>
			      </AuthContainer>

	    	</ScrollableTabView>
	    );
	}
}




export default MainPage;