import React from 'react';
import { View, StatusBar, Navigator,StyleSheet,ScrollView,Text } from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import Tarbar from '../components/TabBar';
import TopicContainer from './TopicContainer';
import AccountContainer from './AccountContainer';
import UserContainer from './UserContainer'


class Main extends React.Component{
	render(){
		return (
			<ScrollableTabView
				locked={true}
	      		initialPage={0}
	      		tabBarPosition="bottom"
	      		scrollWithoutAnimation={true}
	      		renderTabBar={() => <Tarbar />}
	      		>

			      <TopicContainer tabLabel="ios-paper" {...this.props}>
			      </TopicContainer>

			      <AccountContainer tabLabel="ios-people" {...this.props}>
			      </AccountContainer>

			      <ScrollView tabLabel="ios-notifications" {...this.props}>
			          <Text>Notifications</Text>
			      </ScrollView>

			      <UserContainer tabLabel="ios-person" {...this.props}>
			      </UserContainer>

	    	</ScrollableTabView>
	    );
	}
}




export default Main;