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


class MainPage extends React.Component{
	render(){
		return (
			<ScrollableTabView
				locked={true}
	      		initialPage={0}
	      		activeTextColor="red"
	      		tabBarPosition="bottom"
	      		scrollWithoutAnimation={true}
	      		renderTabBar={() => <Tarbar />}
	      		>

			      <TopicListContainer tabLabel="ios-paper" {...this.props}>
			      </TopicListContainer>

			      <NodeListContainer tabLabel="ios-compass-outline" {...this.props}>
			      </NodeListContainer>

			      <MyNotificationContainer tabLabel="ios-notifications" {...this.props}>
			      </MyNotificationContainer>

			      <AuthContainer tabLabel="ios-person-outline" {...this.props}>
			      </AuthContainer>

	    	</ScrollableTabView>
	    );
	}
}




export default MainPage;