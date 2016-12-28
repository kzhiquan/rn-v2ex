import React, { PropTypes } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  ScrollView,
  RefreshControl,
  Alert,
  ListView,
  Image,
  ActivityIndicator,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';


import NavigationBar from 'react-native-navbar';


import LoadingView from '../components/LoadingView'
import AccountContainer from '../containers/AccountContainer'
import TopicContainer from '../containers/TopicContainer'
import UserContainer from '../containers/UserContainer'
import { toastShort } from '../utils/ToastUtil';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyFocusPersonPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { authActions, auth, route } = this.props;
    authActions.requestMyFocusPerson(route.node.path);
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { authActions, auth, route } = this.props;
    authActions.refreshMyFocusPerson(route.node.path);
  }

  _onTopicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
      topic : topic,
    });
  }

  _onUserClick(){
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'UserPage', 
      path : path,
    });
  }

  renderItem(topic) {
    const { navigator } = this.props;
    return (
      <TouchableOpacity onPress={this._onTopicClick} topic={topic} navigator={navigator}>
        <View style={styles.topicItemContainer}>

            <TouchableOpacity onPress={this._onUserClick} navigator={navigator} path={topic.member_url}>
              <Image
                style={styles.avatar_size_42}
                source={{uri:topic.member_avatar}}
              />
            </TouchableOpacity>

            <View style={styles.avatarRightContent}>

              <View>
                <Text style={{fontSize:16}}>{topic.member_name}</Text>
              </View>

              <View style={[styles.directionRow, {paddingTop:4,}]}>
                <View style={styles.nodeAreaContainer}>
                  <Text style={styles.metaTextStyle}>{topic.node_name}</Text>
                </View>
                <View style={[styles.directionRow, {left:10, paddingTop:2}]}>
                  <Text style={styles.metaTextStyle}>{topic.reply_count}</Text>
                  <Image
                    style={{bottom:3}}
                    source={require('../static/imgs/chatbubble.png')}
                  />
                </View>
              </View>

              <View style={{paddingTop:4,}}>
                <Text style={{fontSize:16}}>{topic.topic_title}</Text>
              </View>

              <View style={[styles.directionRow, {paddingTop:4,}]}>
                <View>
                  <Text style={styles.metaTextStyle}>{topic.latest_reply_date}</Text>
                </View>
                <Image
                  style={{top:4,left:4}}
                  source={require('../static/imgs/dot.png')}
                />
                <View style={{left:14}}>
                  <Text style={styles.metaTextStyle}>{'最后回复' + topic.latest_reply_member_name}</Text>
                </View>
              </View>

            </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter(){
    const { auth } = this.props;
    if(auth.myFavoriteTopic.isLoadingMore){
      return (
        <View style={styles.footerContainer} >
          <ActivityIndicator size="small" color="#3e9ce9" />
          <Text style={styles.footerText}>
            数据加载中……
          </Text>
        </View>
      );
    }
  }

  _isCurrentPageFilled(countPerPage=20){
    const { auth } = this.props;
    if(auth.myFavoriteTopic.topicList.length % countPerPage === 0){
      return true;
    }else{
      return false;
    }
  }

  onEndReached() {
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;

      const { authActions, auth, route } = this.props;
      if(this._isCurrentPageFilled()){
        page += 1;
      }
      authActions.requestMoreMyFocusPerson(route.node.path, page);
    }
  }

  onScroll(){
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  render() {
    const { navigator, auth, } = this.props;

    let rows = []
    if(auth.myFocusPerson && auth.myFocusPerson.topicList){
      rows = auth.myFocusPerson.topicList;
    }

    return (
      <View style={styles.container}>

          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(rows)}
            renderRow={this.renderItem.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            onScroll={this.onScroll.bind(this)}
            onEndReachedThreshold={-20}
            enableEmptySections={true}
            removeClippedSubviews = {false}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            refreshControl={
              <RefreshControl
                refreshing={auth.myFavoriteTopic.isRefreshing}
                onRefresh={() => this.onRefresh()}
                title="Loading..."
              />
            }
          />

          <ActivityIndicator
            animating={ auth.myFavoriteTopic.isLoading }
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
let backgroundColor = 'white';


const styles = StyleSheet.create({
 //common
  directionRow:{
    flexDirection : 'row',
  },

  avatar_size_42:{
    width:42,
    height:42,
    borderRadius:8,
  },

  front:{
      position: 'absolute',
      top:300,
      left: (width-50)/2,
      width: 50,
      height:50,
      zIndex: 1,
  },

  navigatorBarStyle:{
    backgroundColor : 'white', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

  //custom
  container : {
    flex : 1,
    backgroundColor : backgroundColor,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42-10,
  },

  topicItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
    paddingRight:12,
  },

  nodeAreaContainer:{
    backgroundColor:'#E8F0FE', 
    borderRadius:3, 
    paddingTop:2, 
    paddingBottom:2, 
    paddingLeft:7, 
    paddingRight:7,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },
});


export default MyFocusPersonPage;