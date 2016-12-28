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

import TopicContainer from '../../containers/TopicContainer'


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyReplyListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    page = 1;
    canLoadMore = false;
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }

  componentDidMount() {
    const { authActions,auth } = this.props;
    authActions.requestMyReply(auth.user);
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { authActions,auth } = this.props;
    authActions.refreshMyReply(auth.user);
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
    //console.log('url', url);
  }

  _onTopicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
      topic : topic,
    });
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }

  renderItem(reply, sectionID, rowID, highlightRow){   
    const { navigator, route } = this.props;
    return (
      <TouchableOpacity onPress={this._onTopicClick} topic={reply.topic} navigator={navigator}>
        
        <View style={[styles.userReplyItemContainer, ]}>

            <Image
              style={styles.avatar_size_42}
              source={{uri:route.user.avatar_url}}
            />
            <View style={styles.avatarRightContent}>

              <View>
                <Text style={{fontSize:16}}>{route.user.name}</Text>
              </View>

              <View style={{paddingTop:8}}>
                <Text style={styles.metaTextStyle}>{reply.date}</Text>
              </View>

              <View style={{paddingTop:6}}>
                <Text style={{fontSize:14}}>{reply.topic.topic_title}</Text>
              </View>
              <View>
                <Image
                  style={{left:32}}
                  source={require('../../static/imgs/triangle.png')}
                  />
                <View style={{backgroundColor:'#F2F2F2', borderRadius:2, paddingTop:2, paddingBottom:2, paddingRight:4, paddingLeft:4}}>
                  <HtmlRender
                    key={`${sectionID}-${rowID}`}
                    value={'<div>' + reply.content + '</div>'}
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
    if(auth.isLoadingMore){
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

      const { authActions, auth } = this.props;
      page += 1;
      authActions.requestMoreMyReply(auth.user, page);
    }
  }

  onScroll(){
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  render() {
    const { navigator, auth } = this.props;

    var titleConfig = {
      title: '我的回复',
    };

    let rows = []
    if(auth.myReply && auth.myReply.replyList){
      rows = auth.myReply.replyList;
    }

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
          />

          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(rows)}
            renderRow={this.renderItem.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            onScroll={this.onScroll.bind(this)}
            onEndReachedThreshold={-50}
            enableEmptySections={true}
            removeClippedSubviews = {false}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            refreshControl={
              <RefreshControl
                refreshing={auth.isRefreshing}
                onRefresh={() => this.onRefresh()}
                title="Loading..."
              />
            }
          />

          <ActivityIndicator
            animating={ auth.isLoading }
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

  userReplyItemContainer:{
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

});


export default MyReplyListPage;


