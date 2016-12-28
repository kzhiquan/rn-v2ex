import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import NavigationBar from 'react-native-navbar';


import MyNotificationContainer from '../../containers/notification/MyNotificationContainer';
import MyFocusPersonContainer from '../../containers/notification/MyFocusPersonContainer';

class NotificationPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount")
  }

  _renderScrollTableBar(){
    return (
      <ScrollableTabBar 
        tabStyle={{paddingLeft:8, paddingRight:8,}}
        tabsContainerStyle={{justifyContent:'space-around',}}
      />
    )
  }

  _onChangeTab(switchInfo){
    console.log('switchInfo', switchInfo);
    if(switchInfo.i == 1){
      //console.log(switchInfo.ref);
      //switchInfo.ref.onRefresh();
    }
  }

  render() {
    const { navigator } = this.props;

    let titleConfig = {
      title: '通知'
    };


    return (
      <View style={styles.container}>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          statusBar={{
            tintColor : '#FAFAFA'
          }}
        />

        <ScrollableTabView
          initialPage={0}
          tabBarTextStyle={{fontSize:16}}
          tabBarActiveTextColor={'black'}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={this._renderScrollTableBar.bind(this)}
          onChangeTab={this._onChangeTab.bind(this)}
          >

          <MyNotificationContainer {...this.props} key={0} tabLabel={'提醒'}/>
          <MyFocusPersonContainer {...this.props} key={1} tabLabel={'关注'} route={{node:{path:'/my/following'}}}/>

        </ScrollableTabView>

      </View>

    );
  }
}


let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = '#EFEFF4';
let tabBarUnderlineColor = '#007AFF';

const styles = StyleSheet.create({

  container : {
    flex : 1,
    backgroundColor : 'white',
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

  tabBarUnderlineStyle:{
    backgroundColor : tabBarUnderlineColor,
    height:2,
  },


});

export default NotificationPage;