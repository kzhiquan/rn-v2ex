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
import AccountContainer from '../containers/auth/AccountContainer';
import UserContainer from '../containers/public/UserContainer';
import ReplyTopicPage from './ReplyTopicPage';
import TopicDialogPage from './TopicDialogPage';
import { toastShort } from '../utils/ToastUtil';
import VXTopicMoreModal from '../components/VXTopicMoreModal';
import VXReplyMoreModal from '../components/VXReplyMoreModal';
import VXModal from '../components/VXModal';
import SITE from '../constants/Config'


let canLoadMore;
let page = 1;
let loadMoreTime = 0;
let reply = null;

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
      topicMoreModalVisible:false,
      replyMoreModalVisible:false,
      unLoginModalVisible:false,
    };
    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }

  componentDidMount() {
    const { topicActions, route, topic } = this.props;
    //topicActions.requestTopic(route.topic);
    topicActions.requestTopic(topic.wrapList, route.topic.topic_url, 1);
  }

  componentWillReceiveProps(nextProps){
    //console.log('nextProps', nextProps);
    const { topic } = nextProps;
    if( topic.isTopicMoreWorking ){
      this.setState({topicMoreModalVisible:false});
    }

    if( topic.isReplyMoreWorking ){
      this.setState({replyMoreModalVisible:false})
    }
  }

  onRefresh(){
    //console.log('onRefresh');
    canLoadMore = false;
    page = 1;
    const { topicActions, route, topic } = this.props;
    //topicActions.requestTopic(true, false, false, route.topic);
    topicActions.refreshTopic(topic.wrapList, route.topic.topic_url, page);
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

  _userClick(){
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'User', 
      path : path,
    });
  }

  _renderTopicTags(topic){

    if(topic.tags && topic.tags.length > 0){
      return (
        <View style={[styles.directionRow, {paddingTop:4}]}>
          {
            topic.tags.map( (tag, index, arr) => {
              return  <View key={index} style={styles.tagAreaContainer}>
                        <Text style={styles.metaTextStyle}>{tag.name}</Text>
                      </View>
            })
          }
        </View>
      )
    }

  }

  _renderTopic(topic,sectionID, rowID, highlightRow){
    if(topic){
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
                  
                  <View style={styles.directionRow}>
                    <Image
                      source={require('../static/imgs/heart.png')}
                    />
                    <View style={{left:4}}>
                      <Text style={styles.metaTextStyle}>感谢</Text>
                    </View>
                  </View>

                  <View style={[styles.directionRow, {left:32}]}>
                    <Image
                      source={require('../static/imgs/chat_reply.png')}
                    />
                    <View style={{left:4}}>
                      <Text style={styles.metaTextStyle}>{topic.reply_count}个回复</Text>
                    </View>
                  </View>

                  <View style={[styles.directionRow,{left:64}]}>
                    <Image
                      source={require('../static/imgs/star.png')}
                    />
                    <View style={{left:4, top:2}}>
                      <Text style={styles.metaTextStyle}>{topic.collect_count || '收藏'}</Text>
                    </View>
                  </View>

                </View>


                <View style={styles.replyBtnContainer}>
                  <Text style={styles.replyBtnText}>回复</Text>
                </View>

              </View>

            </View>

          </View>
      )
    }
  }

  _renderReply(reply, sectionID, rowID, highlightRow){
    //return null;
    /*return (

      <TouchableOpacity onPress={this._onReplyMore} reply={item} that={this}>
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
      </TouchableOpacity>


    );*/
    return (
      <TouchableOpacity>
        <View style={styles.replyItemContainer}>
            <TouchableOpacity>
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
                  <Image
                    source={require('../static/imgs/heart.png')}
                  />

                  <Image
                    style={{left:64}}
                    source={require('../static/imgs/chat_reply.png')}
                  />

                  <Image
                    style={{left:128}}
                    source={require('../static/imgs/at.png')}
                  />
              </View>

            </View>
        </View>
      </TouchableOpacity>

    )
  }

  renderItem(item, sectionID, rowID, highlightRow){
    const { navigator } = this.props;
    if(sectionID == 'topic'){
      return this._renderTopic(item, sectionID, rowID, highlightRow);
    }
    return this._renderReply(item, sectionID, rowID, highlightRow);
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
      const { topicActions, route, topic } = this.props;
      //if ( this._isCurrentPageFilled()){
        page += 1;
      //}
      //topicActions.requestTopic(false, false, true, route.topic, page);
      topicActions.loadMoreTopic(topic.wrapList, route.topic.topic_url, page);
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

  _onTopicMore(){
    this.setState({topicMoreModalVisible:true});
  }

  _onReplyMore(){
    //console.log('onReplyMore');
    //console.log(this, reply);
    const { that } = this;
    reply = this.reply;
    //console.log(this, reply);
    that.setState({replyMoreModalVisible:true});
  }

  _onFavoriteBtnClick(){
    //console.log('_onFavoriteBtnClick');
    const { topicActions, topic, auth } = this.props;
    if(!auth.user){
      this.setState({topicMoreModalVisible:false, unLoginModalVisible:true})
    }else{
      topicActions.startFavoriteTopic(topic.topic.favorite_url)
    }
  }

  _onTopicThankBtnClick(){
    //console.log('onThankBtnClick');
    const { topicActions, topic, auth } = this.props;
    if(!auth.user){
      this.setState({topicMoreModalVisible:false, unLoginModalVisible:true})
    }else{
      topicActions.startThankTopic(topic.topic.thank_url);
    }
  }

  _onTweetBtnClick(){
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
  }

  _onTopicReplyBtnClick(){
    console.log('onReplyBtnClick');
    this.setState({topicMoreModalVisible:false});
    const { navigator, topic, topicActions } = this.props;
    navigator.push({
      component : ReplyTopicPage,
      name : 'ReplyTopicPage',
      topic : topic, 
      topicActions : topicActions,
    });
  }

  _onTopicCancelBtnClick(){
    this.setState({topicMoreModalVisible:false});
  }

  _onReplyThankBtnClick(){
    //console.log('onReplyThankBtnClick');

    const { topicActions, topic, auth } = this.props;
    if(!auth.user){
      this.setState({replyMoreModalVisible:false, unLoginModalVisible:true})
    }else{
      topicActions.startThankReply(reply.thank_url);
    }

  }

  _onReplyReplyBtnClick(){

    const { navigator, topic, auth, topicActions } = this.props;
    if(!auth.user){
      this.setState({replyMoreModalVisible:false, unLoginModalVisible:true});
    }else{
      this.setState({replyMoreModalVisible:false});
      navigator.push({
        component : ReplyTopicPage,
        name : 'ReplyTopicPage',
        topic : topic, 
        reply: reply,
        topicActions : topicActions,
      });
    }

  }

  _onReplyCancelBtnClick(){
    //console.log('onReplyCancelBtnClick');
    this.setState({replyMoreModalVisible:false});
  }

  _onDialogBtnClick(){
    console.log('onDialogBtnClick');

    const { navigator, auth, topic } = this.props;
    if(!auth.user){
      this.setState({replyMoreModalVisible:false, unLoginModalVisible:true});
    }else{
      this.setState({replyMoreModalVisible:false});
      navigator.push({
        component : TopicDialogPage,
        name : 'TopicDialogPage',
        topic : topic, 
        reply: reply,
      });
    }

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

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }

  render() {
    const { topic, route } = this.props;
    let currentTopic = route.topic;
    if(topic.wrapList.topic){
      currentTopic = topic.wrapList.topic;
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

    console.log('rows',rows);
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
            <TouchableOpacity onPress={this._onTopicMore.bind(this)}>
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

        {/*this._renderTopicPart()*/}
        
        {/*<VXTopicMoreModal 
          visible={this.state.topicMoreModalVisible}
          onFavoriteBtnClick={this._onFavoriteBtnClick.bind(this)}
          onThankBtnClick={this._onTopicThankBtnClick.bind(this)}
          onTweetBtnClick={this._onTweetBtnClick.bind(this)}
          onWeiboBtnClick={this._onWeiboBtnClick.bind(this)}
          onSafariBtnClick={this._onSafariBtnClick.bind(this)}
          onReplyBtnClick={this._onTopicReplyBtnClick.bind(this)}
          onCancelBtnClick={this._onTopicCancelBtnClick.bind(this)}/>

        <VXReplyMoreModal 
          visible={this.state.replyMoreModalVisible}
          onThankBtnClick={this._onReplyThankBtnClick.bind(this)}
          onReplyBtnClick={this._onReplyReplyBtnClick.bind(this)}
          onDialogBtnClick={this._onDialogBtnClick.bind(this)}
          onCancelBtnClick={this._onReplyCancelBtnClick.bind(this)}/>

        <VXModal
          visible={this.state.unLoginModalVisible}
          title={'尚未登录，请先登录'}
          btnText={'确定'}
          btnClick={ this._onUnLoginModalClick.bind(this) }
        />*/}

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
          animating={topic.isLoading || topic.isTopicMoreWorking || topic.isReplyMoreWorking }
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



