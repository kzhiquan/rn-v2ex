import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import NavigationBar from 'react-native-navbar';


import TabTopicListContainer from '../../containers/find/TabTopicListContainer';

class FindPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }

  componentDidMount() {
    //console.log("componentDidMount")
  }

  _renderScrollTableBar(){
    return (
      <ScrollableTabBar 
        tabStyle={{paddingLeft:16, paddingRight:16,}}
        tabsContainerStyle={{justifyContent:'center',}}
      />
    )
  }

  render() {
    const { navigator } = this.props;

    let titleConfig = {
      title: '发现'
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
          >

          <TabTopicListContainer {...this.props} key={0} tabLabel={'技术'} node={{path:'/?tab=tech'}}/>
          <TabTopicListContainer {...this.props} key={1} tabLabel={'最热'} node={{path:'/?tab=hot'}}/>
          <TabTopicListContainer {...this.props} key={2} tabLabel={'最热'} node={{path:'/?tab=hot'}}/>
        
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
    width:32
  },
});

export default FindPage;