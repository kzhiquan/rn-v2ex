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
  TouchableOpacity
} from 'react-native';


import NavigationBar from 'react-native-navbar';
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';


import LoadingView from '../components/LoadingView';
import Button from '../components/Button';
import AccountContainer from '../containers/AccountContainer'
import TopicContainer from '../containers/TopicContainer'
import UserContainer from '../containers/UserContainer'
import { toastShort } from '../utils/ToastUtil';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyNotificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.deletedNotifications = [];

    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { authActions, auth, } = this.props;
    authActions.requestMyNotification();
  }

  componentWillReceiveProps(nextProps){
    const { auth } = nextProps;
    if(auth.myNotification.deletedNotification){
      this.deletedNotifications.push(auth.myNotification.deletedNotification);
    }
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { authActions, auth, } = this.props;
    authActions.refreshMyNotification();
    this.deletedNotifications = [];
  }

  _topicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'Topic',
      topic : topic,
    });
  }

  _userClick(){
    console.log('user click');
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'User', 
      path : path,
    });
  }

  _renderNode(node, index, parent, type) {
    //console.log('node:',node);
    if (node.name === 'img') {
        let uri = node.attribs.src;
        if(uri.indexOf('http') == -1){
          uri = 'http:' + uri;
        }

        return (
                <View key={index} style={{flex:1, flexDirection:'row', justifyContent: 'center', width:maxWidth, height:maxWidth,}}>
                  <Image 
                    source={{uri:uri}} 
                    style={{
                      width:maxWidth-30,
                      height:maxWidth-30,
                      resizeMode: Image.resizeMode.contain}} />
                </View>
        )

    }
  }

  _onLinkPress(url){
    console.log('url', url);
  }

  _onDeleteNotification(){
    const { notification, that } = this;
    const { authActions } = that.props;
    authActions.deleteMyNotification(notification);
  }

  _onClickNotification(){
    const { navigator, notification } = this;

    let topic ={
      topic_url : notification.topic_url,
    }

    navigator.push({
      component : TopicContainer,
      name : 'Topic',
      topic : topic,
    });

  }

  renderItem(notification, sectionID, rowID, highlightRow) {

    //console.log('deletedNotifications', this.deletedNotifications);
    let found = this.deletedNotifications.find( (item) => {
      return item == notification;
    });

    if(found){
      return null;
    }

    const { navigator } = this.props;
    return (
      <TouchableOpacity onPress={this._onClickNotification} navigator={navigator} notification={notification}>
        <View style={styles.containerItem}>
            <TouchableOpacity onPress={this._userClick} navigator={navigator} path={notification.member_url}>
                <Image style={styles.itemHeader} source={{uri:notification.member_avatar}} />
            </TouchableOpacity>
            <View style={styles.itemBody}>
              <View style={{flexDirection:'row'}}>
                <Text>{notification.member_name}</Text>
                <Text>{notification.operation}</Text>
                <Text>{notification.topic_title}</Text>
                <Text>{notification.post_date}</Text>
              </View>
              {
                notification.content ? 
                (<HtmlRender
                  key={`${sectionID}-${rowID}`}
                  value={'<div>' + notification.content + '</div>'}
                  onLinkPress={this._onLinkPress.bind(this)}
                  renderNode={this._renderNode}
                />):null
              }

              <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                  <TouchableOpacity 
                    onPress={this._onDeleteNotification}
                    notification={notification}
                    that={this}>
                    <Text>删除</Text>
                  </TouchableOpacity>
              </View>
            </View>
        </View> 
      </TouchableOpacity>

    );
  }

  renderFooter(){
    const { auth } = this.props;
    if(auth.myNotification.isLoadingMore){
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

  _isCurrentPageFilled(countPerPage=10){
    const { auth } = this.props;

    if(auth.myNotification.notificationList.length % countPerPage === 0){
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

      const { authActions, auth, } = this.props;
      if(this._isCurrentPageFilled()){
        page += 1;
      }
      console.log('page', page);
      authActions.requestMoreMyNotification(page);
    }
  }

  onScroll(){
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  render() {
    const { navigator, auth, } = this.props;

    var titleConfig = {
      title: '通知',
    };

    let rows = []
    if(auth.myNotification && auth.myNotification.notificationList){
      rows = auth.myNotification.notificationList;
    }

    return (
      <View style={{flex:1}}>
          <NavigationBar
              title={titleConfig}/>

          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(rows)}
            renderRow={this.renderItem}
            renderFooter={this.renderFooter}
            onEndReached={this.onEndReached}
            onScroll={this.onScroll}
            onEndReachedThreshold={-20}
            enableEmptySections={true}
            removeClippedSubviews = {false}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            refreshControl={
              <RefreshControl
                refreshing={auth.myNotification.isRefreshing}
                onRefresh={() => this.onRefresh()}
                title="Loading..."
              />
            }
          />

          <ActivityIndicator
            animating={ auth.myNotification.isLoading }
            style={styles.front}
            size="large"
          />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerItem:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  itemHeader:{
    width:48,
    height:48
  },
  itemBody:{
    width:280
  },
  itemBodyDetail:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  itemFooter:{
    color:'blue',
    paddingTop: 18
  },

  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },

  front:{
    position: 'absolute',
    top:300,
    left: (375-50)/2,
    width: 50,
    height:50,
    zIndex: 1,
  },

});


export default MyNotificationPage;