import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';


import NavigationBar from 'react-native-navbar';

import SearchContainer from '../../containers/home/SearchContainer';
import TopicListTableView from '../../components/TopicListTableView';
import NewTopicTitlePage from './NewTopicTitlePage';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  _onAccountClick(){
    console.log('_onAccountClick');
  }

  _onSearchClick(){
    console.log('_onSearchClick');
    const { navigator } = this.props;
    navigator.push({
      component : SearchContainer,
      name : 'searchPage'
    });
  }

  _onNewTopicClick(){
    console.log('_onNewTopicClick');
    const { navigator } = this.props;
    navigator.push({
      component : NewTopicTitlePage,
      name : 'NewTopicTitlePage',
    });
  }

  render() {
    const { recentActions, recent, auth, navigator } = this.props; 

    let titleConfig = {
      title: "V2EX"
    };

    return (
      <View style={styles.container}>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          statusBar={{tintColor : '#FAFAFA'}}
          leftButton={
            <TouchableOpacity onPress={this._onAccountClick.bind(this)}>
                <Image style={[styles.avatar_size_32, {left:12, top:6}]} source={{uri:auth.user.avatar_url}}/>
            </TouchableOpacity> 
          }
          rightButton={
            <View style={[styles.directionRow, {right:12}]}>
              <TouchableOpacity onPress={this._onSearchClick.bind(this)}>
                <Image  style={{top:16, right:24}}source={require('../../static/imgs/search.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onNewTopicClick.bind(this)}>
                <Image  style={{top:11}} source={require('../../static/imgs/write.png')}/>
              </TouchableOpacity>
            </View>

          }
        />

        <TopicListTableView
          navigator = {navigator}
          actions = {{
            load : recentActions.requestRecentTopic,
            refresh : recentActions.refreshRecentTopic,
            loadMore : recentActions.requestMoreRecentTopic,
          }}
          payload = {recent}
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

  directionRow:{
    flexDirection : 'row',
  },

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

  front:{
      position: 'absolute',
      top:300,
      left: (width-50)/2,
      width: 50,
      height:50,
      zIndex: 1,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42,
  },

  avatar_size_32:{
    width:32,
    height:32,
    borderRadius: 16,
  },

  favoriteBtnStyle:{
    backgroundColor:'#45CB7F', 
    height: 32,
    borderRadius:5, 
    paddingTop:8, 
    paddingBottom:4, 
    paddingLeft:24, 
    paddingRight:24,
  },

  nodeMetaContainer:{
    paddingTop:12, 
    left:16, 
    paddingBottom:12, 
  },

  whiteBoldFontStyle:{
    fontSize:14, 
    color:'white', 
    fontWeight:'bold',
  },

  nodeAreaContainer:{
    backgroundColor:'#E8F0FE', 
    borderRadius:3, 
    paddingTop:2, 
    paddingBottom:2, 
    paddingLeft:7, 
    paddingRight:7,
  },


});

export default HomePage;