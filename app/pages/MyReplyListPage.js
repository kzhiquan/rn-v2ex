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
  RecyclerViewBackedScrollView
} from 'react-native';


import NavigationBar from 'react-native-navbar';
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';

import LoadingView from '../components/LoadingView'
import { toastShort } from '../utils/ToastUtil';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyReplyListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);
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
    const { authActions,auth } = this.props;
    authActions.refreshMyReply(auth.user);
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

  renderItem(reply) {
    console.log('reply:',reply);    
    return (
      <View style={styles.containerItem}>

        <View>
          <View><Text>{reply.date}:{reply.topic.topic_title}</Text></View>
        </View>

        <View>
          <Text>{reply.content}</Text>
        </View>

      </View>
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

    var leftButtonConfig = {
      title: 'Back',
      handler: function onBack() {
        navigator.pop();
      }
    };

    var titleConfig = {
      title: '我的回复',
    };

    let rows = []
    if(auth.myReply && auth.myReply.replyList){
      rows = auth.myReply.replyList;
    }

    return (
      <View style={{flex:1}}>
          <NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}/>

          { auth.isLoading ? <LoadingView /> : 
              <ListView
                initialListSize = {5}
                dataSource={this.state.dataSource.cloneWithRows(rows)}
                renderRow={this.renderItem}
                renderFooter={this.renderFooter}
                onEndReached={this.onEndReached}
                onScroll={this.onScroll}
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
          }


      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerItem:{
    flex:1,
    flexDirection:'column',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
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

});


export default MyReplyListPage;


