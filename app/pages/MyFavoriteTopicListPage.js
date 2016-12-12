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


import LoadingView from '../components/LoadingView'
import AccountContainer from '../containers/AccountContainer'
import TopicContainer from '../containers/TopicContainer'
import UserContainer from '../containers/UserContainer'
import { toastShort } from '../utils/ToastUtil';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyFavoriteTopicListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);

    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { authActions, auth } = this.props;
    authActions.requestMyFavoriteTopic();
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { authActions, auth } = this.props;
    authActions.refreshMyFavoriteTopic();
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

  renderItem(topic) {
    //console.log('topic:',topic);
    const { navigator } = this.props;
    return (
      <TouchableOpacity onPress={this._topicClick} topic={topic} navigator={navigator}>
        <View style={styles.containerItem}>
          <TouchableOpacity onPress={this._userClick} navigator={navigator} path={topic.member_url}>
              <Image style={styles.itemHeader} source={{uri:topic.member_avatar}} />
          </TouchableOpacity>
          <View style={styles.itemBody}>
            <Text>{topic.topic_title}</Text>
            <View style={styles.itemBodyDetail}>
              <Text>{topic.node_name}</Text>
              <Text>{topic.member_name}</Text>
              <Text>{topic.date}</Text>
              <Text>{topic.latest_reply_member_name}</Text>
            </View>
          </View>
          <Text style={styles.itemFooter}>{topic.reply_count}</Text>
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

      const { authActions, auth } = this.props;
      if(this._isCurrentPageFilled()){
        page += 1;
      }
      authActions.requestMoreMyFavoriteTopic(page);
    }
  }

  onScroll(){
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  render() {
    const { navigator, auth } = this.props;

    var leftButtonConfig = {
      title: 'Back',
      handler: function onBack() {
        navigator.pop();
      }
    };

    var titleConfig = {
      title: '我收藏的主题',
    };

    let rows = []
    if(auth.myFavoriteTopic && auth.myFavoriteTopic.topicList){
      rows = auth.myFavoriteTopic.topicList;
    }

    return (
      <View style={{flex:1}}>
          <NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}/>

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


export default MyFavoriteTopicListPage;