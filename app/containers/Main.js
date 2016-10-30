import React from 'react';
import { View, StatusBar, Navigator,StyleSheet,ScrollView,Text } from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import Tarbar from '../components/TabBar';
import TopicContainer from './TopicContainer';
import AccountContainer from './AccountContainer';


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

			      <TopicContainer tabLabel="ios-paper">
			      </TopicContainer>

			      <AccountContainer tabLabel="ios-people">
			      </AccountContainer>

			      <ScrollView tabLabel="ios-notifications">
			          <Text>Notifications</Text>
			      </ScrollView>

			      <ScrollView tabLabel="ios-list">
			          <Text>Other nav</Text>
			      </ScrollView>

	    	</ScrollableTabView>
	    );
	}
}




export default Main;