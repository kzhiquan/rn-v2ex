import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import NavigationBar from 'react-native-navbar';


class NodePage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }

  componentDidMount() {
    //console.log("componentDidMount")
    const { nodeListActions, route } = this.props;
    nodeListActions.requestNodePage(route.node.path);
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
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
    const { navigator, nodeList, route } = this.props;

    let titleConfig = {
      title: route.node.name
    };

    console.log('route', route);

    return (
      <View style={styles.container}>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          leftButton={
            <TouchableOpacity onPress={this._onBackClick.bind(this)}>
                <Image style={{left:12, top:11}} source={require('../../static/imgs/back_arrow.png')}/>
            </TouchableOpacity> 
          }
          statusBar={{tintColor : '#FAFAFA'}}
        />

        <ScrollableTabView
          initialPage={0}
          tabBarTextStyle={{fontSize:16}}
          tabBarActiveTextColor={'black'}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={this._renderScrollTableBar.bind(this)}
          >

          <View key={0} tabLabel={'技术'} node={{path:'/?tab=tech'}}/>
          <View {...this.props} key={1} tabLabel={'最热'} node={{path:'/?tab=hot'}}/>
          <View {...this.props} key={2} tabLabel={'漫游'} />
        
        </ScrollableTabView>

        <ActivityIndicator
          animating={ nodeList.isLoading }
          style={styles.front}
          size="large"
        />

      </View>

    );
  }
}

const {height, width} = Dimensions.get('window');
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

  front:{
      position: 'absolute',
      top:300,
      left: (width-50)/2,
      width: 50,
      height:50,
      zIndex: 1,
  },

});

export default NodePage;