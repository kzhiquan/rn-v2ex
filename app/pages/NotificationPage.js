import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import NavigationBar from 'react-native-navbar';


import MyNotificationContainer from '../containers/MyNotificationContainer';

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

  render() {
    const { navigator } = this.props;

    let titleConfig = {
      title: '通知'
    };


    return (
      <View>

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
          tabBarUnderlineStyle={{ backgroundColor:'#007AFF',}}
          renderTabBar={this._renderScrollTableBar.bind(this)} 
          >

          <MyNotificationContainer key={0} tabLabel={'提醒'} />
          <MyNotificationContainer key={1} tabLabel={'关注'} />

        </ScrollableTabView>

      </View>

    );
  }
}


let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = '#EFEFF4';

const styles = StyleSheet.create({

  container : {
    flex : 1,
    backgroundColor : backgroundColor,
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

});

export default NotificationPage;