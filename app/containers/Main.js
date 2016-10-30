import React from 'react';
import { View, StatusBar, Navigator } from 'react-native';

import ScrollableTabView  from 'react-native-scrollable-tab-view';
import TopicContainer from './TopicContainer';
import AccountContainer from './AccountContainer';


class Main extends React.Component{
	render(){
	    return (
	      <ScrollableTabView 
	      	tabBarPosition="bottom"
	      	locked={true}
	      	scrollWithoutAnimation={true}
	      	tabBarUnderlineStyle={{height:0}}>

	        <TopicContainer tabLabel="Topic" />
	        <AccountContainer tabLabel="Account" />

	      </ScrollableTabView>
	    );
	}
}




export default Main;