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
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';
import Icon from 'react-native-vector-icons/Ionicons';

import ResizableImage from '../components/ResizableImage'
import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import UserContainer from '../containers/UserContainer';
import ReplyTopicPage from './ReplyTopicPage'
import { toastShort } from '../utils/ToastUtil';
import VXMoreModal from '../components/VXMoreModal';
import VXModal from '../components/VXModal';
import SITE from '../constants/Config'


let canLoadMore;
let page = 1;
let loadMoreTime = 0;

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

class TopicPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (h1, h2) => h1 !== h2,  
      }),
      modalVisible: false,
      moreModalVisible:false,
      unLoginModalVisible:false,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);
    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }

  componentDidMount() {
    const { topicActions, route } = this.props;
    topicActions.requestTopic(false, true, false, route.topic);
  }

  componentWillReceiveProps(nextProps){
    //console.log('nextProps', nextProps);
    const { topic } = nextProps;
    if( topic.isWorking ){
      this.setState({moreModalVisible:false});
    }
  }

  onRefresh(){
    //console.log('onRefresh');
    canLoadMore = false;
    page = 1;
    const { topicActions, route } = this.props;
    topicActions.requestTopic(true, false, false, route.topic);
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
                /*<ResizableImage 
                    source={{uri:uri}}
                    style={{}} />*/
        )

    }
  }

  _onLinkPress(url){
    console.log('url', url);
  }

  _userClick(){
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'User', 
      path : path,
    });
  }

  renderItem(item, sectionID, rowID, highlightRow){
    const { navigator } = this.props;
    if(sectionID == 'topic'){
      return (
        <View style={styles.containerTopic}>
          <View style={styles.topicHeader}><Text style={{fontWeight:'bold'}}>{item.topic_title}</Text></View>
          <HtmlRender
            key={`${sectionID}-${rowID}`}
            value={'<div>' + item.topic_content + '</div>'}
            stylesheet={topicTitleStyle}
            onLinkPress={this._onLinkPress.bind(this)}
            renderNode={this._renderNode}
          />
          <View style={styles.topicFooter}>
            <Text style={{fontWeight:'bold'}}>{item.click_count}</Text>
            <Text style={{fontWeight:'bold'}}>{item.collect_count}</Text>
            <Text style={{fontWeight:'bold'}}>{item.vote_count ? (item.vote_count + '人') : ''}</Text>
          </View>
        </View>
      );
    }

    //console.log('item', item);

    return (
      <View style={styles.containerReply}>
        <TouchableOpacity onPress={this._userClick} navigator={navigator} path={item.member_url}>
          <Image style={styles.replyHeader} source={{uri:item.member_avatar}} />
        </TouchableOpacity>
        <View style={styles.replyBody}>
          <HtmlRender
            key={`${sectionID}-${rowID}`}
            value={'<div>' + item.content + '</div>'}
            stylesheet={topicTitleStyle}
            onLinkPress={this._onLinkPress.bind(this)}
            renderNode={this._renderNode}
          />
          <View style={styles.replyBodyDetail}>
            <Text>{item.member_name}</Text>
          </View>
        </View>
        <Text style={styles.replyFooter}>{item.floor_number}</Text>
      </View>
    );
  }

  renderFooter(){
    const { topic } = this.props;
    if(topic.isLoadingMore){
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

  onEndReached() {
    //console.log('outer onEndReached page', page);

    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
      const { topicActions, route } = this.props;
      if ( this._isCurrentPageFilled()){
        page += 1;
      }
      topicActions.requestTopic(false, false, true, route.topic, page);
    }
  }

  _isCurrentPageFilled(countPerPage=100){
    const { topic } = this.props;
    let replyCount = topic.topic.replyList.length;
    if(replyCount == 0){
      return false;
    }

    let lastReplyFloor = parseInt(topic.topic.replyList[replyCount-1].floor_number);
    if( lastReplyFloor % countPerPage == 0 ){
      return true;
    }else{
      return false;
    }
  }


  onScroll() {
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  _onMore(){
    //console.log('more');
    this.setState({moreModalVisible:true});
  }

  _onFavoriteBtnClick(){
    //console.log('_onFavoriteBtnClick');
    const { topicActions, topic, auth } = this.props;
    if(!auth.user){
      this.setState({moreModalVisible:false, unLoginModalVisible:true})
    }else{
      topicActions.startFavoriteTopic(topic.topic.favorite_url)
    }
  }

  _onThankBtnClick(){
    //console.log('onThankBtnClick');
    const { topicActions, topic, auth } = this.props;
    if(!auth.user){
      this.setState({moreModalVisible:false, unLoginModalVisible:true})
    }else{
      topicActions.startThankTopic(topic.topic.thank_url);
    }
  }

  _onTweetBtnClick(){
    //console.log('onTweetBtnClick');
    const { topic, auth } = this.props;
    if(!auth.user){
      this.setState({moreModalVisible:false, unLoginModalVisible:true})
    }else{
      console.log(topic.topic.twitter_url);
      Linking.openURL(topic.topic.twitter_url).catch(err => console.log('error', err));
    }
  }

  _onWeiboBtnClick(){
    //console.log('onWeiboBtnClick');
    const { topic, auth } = this.props;
    if(!auth.user){
      this.setState({moreModalVisible:false, unLoginModalVisible:true})
    }else{
      console.log(topic.topic.weibo_url);
      Linking.openURL(topic.topic.weibo_url).catch(err => console.log('error', err));
    }
  }

  _onSafariBtnClick(){
    //console.log('onSafariBtnClick');
    const { topic } = this.props;
    //console.log('topic', topic);
    let url = SITE.HOST + topic.topic.topic_url.split('#')[0];
    //console.log('url', url);
    Linking.openURL(url).catch(err => console.log('error', err));
  }

  _onReplyBtnClick(){
    console.log('onReplyBtnClick');
    this.setState({moreModalVisible:false});
    const { navigator, topic, topicActions } = this.props;
    navigator.push({
      component : ReplyTopicPage,
      name : 'ReplyTopicPage',
      topic : topic, 
      topicActions : topicActions,
    });
  }

  _onCancelBtnClick(){
    this.setState({moreModalVisible:false});
  }

  _onUnLoginModalClick(){
    //console.log('onUnLoginModalClick');
    const { navigator } = this.props;
    this.setState({unLoginModalVisible:false});
    navigator.push({
        component : AccountContainer,
        name:'Account'
    });
  }


  render() {
    const { topic, route } = this.props;
    //console.log('render TopicPage');
    if (topic.isLoading){
      return <LoadingView />
    }

    const { navigator } = this.props;
    let leftButtonConfig = {
      title: 'Back',
      handler: function onBack() {
        navigator.pop();
      }
    };

    let rightButtonConfig = {
      title:'...',
      handler:this._onMore.bind(this),
    }

    let currentTopic = route.topic;
    if(topic.topic){
      currentTopic = topic.topic;
    }
    var titleConfig = {
      title: currentTopic.reply_count + '个回答',
    };

    let replyRows = [];
    if(currentTopic.replyList){
      replyRows = currentTopic.replyList;
    }

    let rows;
    rows = {
      'topic' : [currentTopic],
      'reply' : replyRows,
    }

    //console.log('rows',rows,topic);
    return (
      <View style={{flex:1}}>

        <NavigationBar
            title={titleConfig}
            leftButton={leftButtonConfig}
            rightButton={
              <TouchableOpacity onPress={this._onMore.bind(this)}>
                <Icon name="ios-more" size={30} style={{marginRight:10, marginTop:10}} color="blue"/>
              </TouchableOpacity> 
            }
        />
        
        <VXMoreModal 
          visible={this.state.moreModalVisible}
          onFavoriteBtnClick={this._onFavoriteBtnClick.bind(this)}
          onThankBtnClick={this._onThankBtnClick.bind(this)}
          onTweetBtnClick={this._onTweetBtnClick.bind(this)}
          onWeiboBtnClick={this._onWeiboBtnClick.bind(this)}
          onSafariBtnClick={this._onSafariBtnClick.bind(this)}
          onReplyBtnClick={this._onReplyBtnClick.bind(this)}
          onCancelBtnClick={this._onCancelBtnClick.bind(this)}/>

        <VXModal
          visible={this.state.unLoginModalVisible}
          title={'尚未登录，请先登录'}
          btnText={'确定'}
          btnClick={ this._onUnLoginModalClick.bind(this) }
        />

        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
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
              refreshing={topic.isRefreshing}
              onRefresh={() => this.onRefresh()}
              title="Loading..."
            />
          }
        />

        <ActivityIndicator
          animating={topic.isWorking}
          style={styles.front}
          size="large"
        />

      </View>

    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  containerReply:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  replyHeader:{
    width:48,
    height:48
  },
  replyBody:{
    width:280
  },
  replyBodyDetail:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  replyFooter:{
    color:'blue',
    paddingTop: 18
  },


  containerTopic:{
    flex : 1,
  },
  topicHeader:{
  },
  topicBody:{

  },
  topicFooter:{
    flex : 1,
    flexDirection : 'row',
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

const topicTitleStyle = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },

});

export default TopicPage;



