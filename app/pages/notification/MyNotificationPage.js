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
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';


import Button from '../../components/Button';
import AccountContainer from '../../containers/auth/AccountContainer'
import TopicContainer from '../../containers/TopicContainer'
import UserContainer from '../../containers/public/UserContainer'


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyNotificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
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

  _onUserClick(){
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'UserPage', 
      path : path,
    });
  }

  _renderNode(node, index, parent, type) {

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

  _onNotificationClick(){
    const { navigator, notification } = this;
    let topic ={
      topic_url : notification.topic_url,
    }

    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
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

    if(!notification.content){
      notification.content = '收藏了主题';
    }

    return (
      <TouchableOpacity onPress={this._onNotificationClick} navigator={navigator} notification={notification}>

        <View style={styles.notificationItemContainer}>

            <TouchableOpacity onPress={this._onUserClick} navigator={navigator} path={notification.member_url}>
              <Image
                style={styles.avatar_size_42}
                source={{uri:notification.member_avatar}}
              />
            </TouchableOpacity>

            <View style={styles.avatarRightContent}>
              <View style={[styles.directionRow,{justifyContent:'space-between'}]}>
                  <View>
                    <View>
                      <Text style={{fontSize:16}}>{notification.member_name}</Text>
                    </View>

                    <View style={{paddingTop:8}}>
                      <Text style={styles.metaTextStyle}>{notification.post_date}</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    onPress={this._onDeleteNotification}
                    notification={notification}
                    that={this}>
                      <View style={styles.deleteBtnStyle}>
                        <Text style={styles.whiteBoldFontStyle}>删除</Text>
                      </View>
                  </TouchableOpacity>
              </View>

              <View style={{paddingTop:6}}>
                <Text style={{fontSize:14}}>{notification.topic_title}</Text>
              </View>

              <View>
                <Image
                  style={{left:32}}
                  source={require('../../static/imgs/triangle.png')}
                  />
                <View style={{backgroundColor:'#F2F2F2', borderRadius:2, paddingTop:2, paddingBottom:2, paddingRight:4, paddingLeft:4}}>
                  <HtmlRender
                    key={`${sectionID}-${rowID}`}
                    value={'<div>' + notification.content + '</div>'}
                    onLinkPress={this._onLinkPress.bind(this)}
                    renderNode={this._renderNode}
                  />
                </View>
              </View>
            </View>

        </View>

      </TouchableOpacity>
    )
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
    const { auth, } = this.props;
    let rows = []
    if(auth.myNotification && auth.myNotification.notificationList){
      rows = auth.myNotification.notificationList;
    }

    return (
      <View>
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

  notificationItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },

  deleteBtnStyle:{
    backgroundColor:'#4D2424', 
    height: 28,
    borderRadius:5, 
    paddingTop:7, 
    paddingBottom:5, 
    paddingLeft:19, 
    paddingRight:19,
  },

  whiteBoldFontStyle:{
    fontSize:12, 
    color:'white', 
    fontWeight:'bold',
  },
});


export default MyNotificationPage;