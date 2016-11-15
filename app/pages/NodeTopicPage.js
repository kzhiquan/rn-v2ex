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
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import { toastShort } from '../utils/ToastUtil';
import VXModal from '../components/VXModal';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;

class NodeTopicPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
      modalVisible: false,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);
    canLoadMore = false;
  }

  componentWillMount() {
    console.log("componentWillMount");
    const { topicActions } = this.props;
  }

  componentDidMount() {
    console.log("componentDidMount");
    const { topicActions, route } = this.props;
    topicActions.requestTopic(false, true, false, route.node.path);
  }

  onRefresh(){
    console.log('onRefresh');
    canLoadMore = false;
    const { topicActions, route } = this.props;
    topicActions.requestTopic(true, false, false, route.node.path);
  }

  renderItem(topic) {
    return (
      <View style={styles.containerItem}>
        <Image style={styles.itemHeader} source={{uri:topic.member_avatar}} />
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
    )
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
    /*const { topicActions, route } = this.props;
    page += 1;
    topicActions.requestTopic(false, false, true, route.node.path, page);*/
    console.log('outer onEndReached page', page);

    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;

      const { topicActions, route } = this.props;
      page += 1;
      topicActions.requestTopic(false, false, true, route.node.path, page);
      console.log('in onEndReached page', page);
    }
  }

  onScroll() {
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }


  render() {
    const { topic } = this.props;
    console.log('render NodeTopicPage');
    if (topic.isLoading){
      return <LoadingView />
    }

    const { navigator, route } = this.props;
    var leftButtonConfig = {
      title: 'Back',
      handler: function onBack() {
        navigator.pop();
      }
    };

    var titleConfig = {
      title: route.name,
    };


    let rows = [];
    if(topic.topicList && route.node.path in topic.topicList){
      rows = topic.topicList[route.node.path];
    }
    console.log('rows', rows.length);
    return (
      <View>
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
          onEndReachedThreshold={-50}
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


});

export default NodeTopicPage;