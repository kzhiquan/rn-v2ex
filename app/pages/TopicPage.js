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
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';

import ResizableImage from '../components/ResizableImage'
import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import { toastShort } from '../utils/ToastUtil';
import VXModal from '../components/VXModal';


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

  onRefresh(){
    //console.log('onRefresh');
    canLoadMore = false;
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
        <Image style={styles.replyHeader} source={{uri:item.member_avatar}} />
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
      if(this._isCurrentPageFilled()){
        page += 1;
      }
      topicActions.requestTopic(false, false, true, route.topic, page);
      //console.log('in onEndReached page', page);
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


  render() {
    const { topic, route } = this.props;
    //console.log('render TopicPage');
    if (topic.isLoading){
      return <LoadingView />
    }

    const { navigator } = this.props;
    var leftButtonConfig = {
      title: 'Back',
      handler: function onBack() {
        navigator.pop();
      }
    };

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
              leftButton={leftButtonConfig}/>
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

});

const topicTitleStyle = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },

});

export default TopicPage;



