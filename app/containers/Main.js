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
import TopicListContainer from './TopicListContainer';
import AccountContainer from './AccountContainer';
import AuthContainer from './AuthContainer';
import NodeListContainer from './NodeListContainer';


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

			      <TopicListContainer tabLabel="ios-paper" {...this.props}>
			      </TopicListContainer>

			      <NodeListContainer tabLabel="ios-compass-outline" {...this.props}>
			      </NodeListContainer>

			      <ScrollView tabLabel="ios-notifications" {...this.props}>
			          <Text>Notifications</Text>
			      </ScrollView>

			      <AuthContainer tabLabel="ios-person" {...this.props}>
			      </AuthContainer>

	    	</ScrollableTabView>
	    );
	}
}




export default Main;