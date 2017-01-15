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
import Share, {ShareSheet, Button} from 'react-native-share';

import ResizableImage from '../components/ResizableImage'
import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/auth/AccountContainer';
import UserContainer from '../containers/public/UserContainer';
import ReplyTopicPage from './ReplyTopicPage';
import TopicDialogPage from './TopicDialogPage';
import { toastShort } from '../utils/ToastUtil';
import VXTopicMoreModal from '../components/VXTopicMoreModal';
import VXReplyMoreModal from '../components/VXReplyMoreModal';
import VXModal from '../components/VXModal';
import SITE from '../constants/Config';
import SharePage from './SharePage';


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
    };
    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { topicActions, route, topic } = this.props;
    topicActions.requestTopic(topic.wrapList, route.topic.topic_url, 1);
    loadMoreTime = Date.parse(new Date()) / 1000;
  }

  componentWillReceiveProps(nextProps){
    //console.log('nextProps', nextProps);
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { topicActions, route, topic } = this.props;
    topicActions.refreshTopic(topic.wrapList, route.topic.topic_url, page);
    loadMoreTime = Date.parse(new Date()) / 1000;
  }

  _renderNode(node, index, parent, type) {
    //console.log('node:',node);
    if (node.name === 'img') {
        let uri = node.attribs.src;
        if(uri.indexOf('http') == -1){
          uri = 'http:' + uri;
        }

        return (
                <View key={index} 
                      style={{
                        flex:1, 
                        flexDirection:'row', 
                        justifyContent: 'center', 
                        alignItems:'center', 
                        width:maxWidth-12-12, 
                        height:maxWidth,
                        backgroundColor:'rgba(3, 3, 3,0.5)',
                      }}>
                  <Image 
                    source={{uri:uri}} 
                    style={{
                      width:maxWidth-12-12,
                      height:maxWidth,
                      resizeMode: Image.resizeMode.contain
                    }} />
                </View>
        )

    }
  }

  _onLinkPress(url){
    console.log('url', url);
  }


  _renderTopicTags(topic){

    function TagComponent(tag, index, arr){
      return (
          <View key={index} style={styles.tagAreaContainer}>
              <Text style={styles.metaTextStyle}>{tag.name}</Text>
          </View>
      )
    }

    if(topic.tags && topic.tags.length > 0){

      return (
        <View style={[styles.directionRow, {paddingTop:4}]}>
          {topic.tags.map(TagComponent)}
        </View>
      )

    }

  }

  _renderTopic(topic,sectionID, rowID, highlightRow){
    if(topic){
      //console.log('topic', topic);
      let thankIcon = require('../static/imgs/heart.png');
      if(topic.thank_url == 'done'){
        thankIcon = require('../static/imgs/heart_red.png');
      }

      let favoriteIcon = require('../static/imgs/star.png');
      if(topic.favorite_url && topic.favorite_url.startsWith('/unfavorite')){
        favoriteIcon = require('../static/imgs/star_red.png');
      }

      return (
          <View style={styles.topicContainer}>

            <View style={styles.topicInnerContainer}>
            
              <View style={styles.directionRow}>

                  <Image
                    style={styles.avatar_size_42}
                    source={{uri:topic.member_avatar}}
                  />

                  <View style={styles.topicMetaContainer}>

                    <View>
                      <View>
                        <Text style={{fontSize:16}}>{topic.member_name}</Text>
                      </View>

                      <View style={[styles.directionRow, {paddingTop:4,}]}>
                        <View>
                          <Text style={styles.metaTextStyle}>{topic.post_date}</Text>
                        </View>
                        <Image
                          style={{top:4,left:4}}
                          source={require('../static/imgs/dot.png')}
                        />
                        <View style={{left:14}}>
                          <Text style={styles.metaTextStyle}>{topic.click_count}</Text>
                        </View>
                      </View>

                    </View>

                    <View style={styles.nodeAreaContainer}>
                      <Text style={styles.metaTextStyle}>{topic.node_name}</Text>
                    </View>

                  </View>
              </View>

              <View style={{paddingTop:8}}>
                <Text style={{fontSize:16}}>{topic.topic_title}</Text>
              </View>

              {this._renderTopicTags(topic)}

              <View style={{paddingTop:4}}>
                <HTMLView
                  value={'<div>' + topic.topic_content + '</div>'}
                  stylesheet={{fontSize:14}}
                  renderNode={this._renderNode}
                  onLinkPress={this._onLinkPress}
                />
              </View>


              <View style={styles.topicFooterContainer}>

                <View style={[styles.directionRow, {top:6}]}>
                  
                  <TouchableOpacity onPress={this._onTopicThankClick.bind(this)}>
                    <View style={styles.directionRow}>
                      <Image
                        source={thankIcon}
                      />
                      <View style={{paddingLeft:4}}>
                        <Text style={styles.metaTextStyle}>感谢</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.directionRow, {left:32}]}>
                    <Image
                      source={require('../static/imgs/chat_reply.png')}
                    />
                    <View style={{left:4}}>
                      <Text style={styles.metaTextStyle}>{topic.reply_count}个回复</Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={this._onTopicFavoriteClick.bind(this)}>
                    <View style={[styles.directionRow,{left:64}]}>
                      <Image
                        source={favoriteIcon}
                      />
                      <View style={{paddingLeft:4, paddingTop:2}}>
                        <Text style={styles.metaTextStyle}>{topic.collect_count || '收藏'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                </View>


                <TouchableOpacity onPress={this._onTopicReplyClick.bind(this)}>
                  <View style={styles.replyBtnContainer}>
                    <Text style={styles.replyBtnText}>回复</Text>
                  </View>
                </TouchableOpacity>

              </View>

            </View>

          </View>
      )
    }
  }

  _renderReply(reply, sectionID, rowID, highlightRow){

    let thankIcon = require('../static/imgs/heart.png');
    if(reply.thank_url == 'done'){
        thankIcon = require('../static/imgs/heart_red.png');
    }

    return (
      <View style={styles.replyItemContainer}>
          <TouchableOpacity onPress={()=>this._onReplyUserClick(reply)}>
            <Image
              style={styles.avatar_size_42}
              source={{uri:reply.member_avatar}}
            />
          </TouchableOpacity>

          <View style={styles.avatarRightContent}>

            <View>
              <Text style={{fontSize:16}}>{topic.member_name}</Text>
            </View>

            <View style={[styles.directionRow, {paddingTop:8,}]}>

              <View>
                <Text style={styles.metaTextStyle}>{reply.post_date}</Text>
              </View>

              <Image
                style={{top:4,left:4}}
                source={require('../static/imgs/dot.png')}
              />

              <View style={{left:14}}>
                <Text style={styles.metaTextStyle}>{reply.floor_number+'楼'}</Text>
              </View>

            </View>

            <View style={{paddingTop:8,}}>
              <HTMLView
                value={'<div>' + reply.content + '</div>'}
                stylesheet={{fontSize:14}}
              />
            </View>

            <View style={[styles.directionRow, {paddingTop:8}]}>

                <TouchableOpacity onPress={()=>this._onReplyThankClick(reply)}>
                  <Image
                    source={thankIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this._onReplyDialogClick(reply)}>
                  <Image
                    style={{left:64}}
                    source={require('../static/imgs/chat_reply.png')}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this._onReplyReplyClick(reply)}>
                  <Image
                    style={{left:128}}
                    source={require('../static/imgs/at.png')}
                  />
                </TouchableOpacity>
            </View>

          </View>
      </View>

    )
    
  }

  renderItem(item, sectionID, rowID, highlightRow){
    const { navigator } = this.props;
    if(sectionID == 'topic'){
      return this._renderTopic(item, sectionID, rowID, highlightRow);
    }else{
      return this._renderReply(item, sectionID, rowID, highlightRow);
    }
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
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
      const { topicActions, route, topic } = this.props;
      if ( this._isCurrentPageFilled()){
        page += 1;
      }
      topicActions.loadMoreTopic(topic.wrapList, route.topic.topic_url, page);
    }
  }

  _isCurrentPageFilled(countPerPage=100){
    const { topic } = this.props;
    /*let replyCount = topic.wrapList.list.length;
    if(replyCount == 0){
      return false;
    }

    let lastReplyFloor = parseInt(topic.wrapList.list[replyCount-1].floor_number);
    let remaimder = lastReplyFloor % countPerPage;
    if( countPerPage - remaimder > 5 )
    if( lastReplyFloor % countPerPage == 0 ){
      return true;
    }else{
      return false;
    }*/
    let currentCount = topic.wrapList.list.length;
    if(currentCount < parseInt(topic.wrapList.topic.reply_count)){
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

  _onTopicFavoriteClick(){
    console.log('_onTopicFavoriteClick');
    const { topicActions, topic, auth } = this.props;
    topicActions.startFavoriteTopic(topic.wrapList.topic);
  }

  _onTopicThankClick(){
    console.log('onTopicThankBtnClick');
    const { topicActions, topic, auth } = this.props;
    if(topic.wrapList.topic.thank_url !== 'done'){
      topicActions.startThankTopic(topic.wrapList.topic.thank_url);
    }
  }

  _onTopicReplyClick(){
    console.log('onTopicReplyBtnClick');
    const { navigator, topic, topicActions } = this.props;
    navigator.push({
      component : ReplyTopicPage,
      name : 'ReplyTopicPage',
      wrapList : topic.wrapList, 
      topicActions : topicActions,
    });
  }


  _onReplyUserClick(reply){
    const { navigator } = this.props;
    navigator.push({
      component : UserContainer,
      name : 'UserPage', 
      path : reply.member_url,
    });
  }

  _onReplyThankClick(reply){
    console.log('_onReplyThankClick', reply);
    if(reply.thank_url !== 'done'){
      const { topicActions } = this.props;
      topicActions.startThankReply(reply);
    }
  }

  _onReplyDialogClick(reply){
    console.log('_onReplyDialogClick', reply);
    const { navigator, topic } = this.props;
    navigator.push({
      component : TopicDialogPage,
      name : 'TopicDialogPage',
      wrapList : topic.wrapList, 
      reply: reply,
    });

  }

  _onReplyReplyClick(reply){
    console.log('_onReplyReplyClick', reply);
    const { navigator, topic, topicActions } = this.props;

    navigator.push({
      component : ReplyTopicPage,
      name : 'ReplyTopicPage',
      wrapList : topic.wrapList, 
      reply: reply,
      topicActions : topicActions,
    });

  }

  /*_onTweetBtnClick(){
    //console.log('onTweetBtnClick');
    const { topic, auth } = this.props;
    if(!auth.user){
      this.setState({topicMoreModalVisible:false, unLoginModalVisible:true})
    }else{
      console.log(topic.topic.twitter_url);
      Linking.openURL(topic.topic.twitter_url).catch(err => console.log('error', err));
    }
  }

  _onWeiboBtnClick(){
    //console.log('onWeiboBtnClick');
    const { topic, auth } = this.props;
    if(!auth.user){
      this.setState({topicMoreModalVisible:false, unLoginModalVisible:true})
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
  }*/

  _onShareTopicClick(){
    /*console.log('_onShareTopicClick');
    const { navigator } = this.props;
    navigator.push({
      component : SharePage,
      name : 'SharePage'
    });*/
    let shareOptions = {
      title: "React Native",
      message: "Hola mundo",
      url: "http://facebook.github.io/react-native/",
      subject: "Share Link" //  for email
    };

    Share.open(shareOptions);
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }

  render() {
    const { topic, route } = this.props;
    let currentTopic = route.topic;
    if(topic.wrapList.topic){
      currentTopic = topic.wrapList.topic;
      currentTopic.member_name = route.topic.member_name;
      currentTopic.node_name = route.topic.node_name;
    }

    var titleConfig = {
      title: currentTopic.reply_count + '个回答',
    };

    let replyRows = [];
    if(topic.wrapList){
      replyRows = topic.wrapList.list;
    }

    let rows;
    rows = {
      'topic' : [currentTopic],
      'reply' : replyRows,
    }

    //console.log('rows',rows);
    return (
      <View style={styles.container}>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          leftButton={
            <TouchableOpacity onPress={this._onBackClick.bind(this)}>
                <Image 
                  style={{left:12, top:11}} 
                  source={require('../static/imgs/back_arrow.png')}
                />
            </TouchableOpacity> 
          }
          rightButton={
            <TouchableOpacity onPress={this._onShareTopicClick.bind(this)}>
                <Image 
                  style={{right:12, top:11}} 
                  source={require('../static/imgs/share.png')}
                />
            </TouchableOpacity> 
          }
          statusBar={{
            tintColor : '#FAFAFA'
          }}
        />

        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRowsAndSections(rows, Object.keys(rows))}
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
              refreshing={topic.isRefreshing}
              onRefresh={() => this.onRefresh()}
              title="Loading..."
            />
          }
        />


        <ActivityIndicator
          animating={topic.isLoading }
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
let noteTextColor = '#A0ADB8';
let backgroundColor = 'white';

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : 'white',
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : '#B2B2B2',
  },

  //topic part
  directionRow:{
    flexDirection : 'row',
  },

  topicContainer:{
    flex:1,
    paddingTop:12, 
    left:16, 
    paddingBottom:8, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
  },

  topicInnerContainer:{
    width: width - 16 - 12 - 8,
  },

  topicMetaContainer :{
    flex:1, 
    left:10, 
    flexDirection : 'row', 
    justifyContent:'space-between',
  },
  avatar_size_42:{
    width:42,
    height:42,
    borderRadius:8,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  nodeAreaContainer:{
    backgroundColor:'#E8F0FE', 
    borderRadius:3, 
    paddingTop:3, 
    paddingBottom:1, 
    paddingLeft:7, 
    paddingRight:7,
    top:10,
    height:20,
  },

  tagAreaContainer:{
    backgroundColor:'#F2F2F2', 
    borderRadius:3, 
    paddingTop:3, 
    paddingBottom:1, 
    paddingLeft:7, 
    paddingRight:7,
    marginRight:8,
  },

  topicFooterContainer:{
    flex:1,
    paddingTop:16, 
    justifyContent:'space-between',
    flexDirection : 'row',
  },

  replyBtnContainer:{
    backgroundColor:'#45CB7F', 

    paddingTop:8, 
    paddingBottom:4, 
    paddingLeft:24, 
    paddingRight:24,

    width:77,
    height:32,
    left:12,
    borderRadius:5, 
  },

  replyBtnText:{
    color : 'white',
    fontSize : 14,
  },

  //reply item part
  replyItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
    paddingBottom: 8,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42,
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
    left: (width-50)/2,
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



