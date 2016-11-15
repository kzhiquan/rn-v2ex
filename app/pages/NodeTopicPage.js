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


class NodeTopicPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
      modalVisible: false,
    };
    this._rows = [];
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentWillMount() {
    console.log("componentWillMount");
    const { topicActions } = this.props;
    topicActions.nodeTopicPageInit();
  }

  componentDidMount() {
    console.log("componentDidMount");
    const { topicActions, route } = this.props;
    topicActions.requestTopic(false, true, false, route.node.path);
  }

  onRefresh(){
    console.log('onRefresh');
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
        </View>
      );
    }

  }

  onEndReached() {
    console.log('onEndReached');
    const { topicActions, route } = this.props;
    topicActions.requestTopic(false, false, true, route.node.path);
  }

  onScroll(){
    console.log('onScroll');
  }


  render() {
    const { topic } = this.props;
    console.log('render NodeTopicPage');
    if (topic.isLoading || !topic.isInitialized){
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

    console.log('rows', this._rows.length, topic.topicList.length);

    this._rows = this._rows.concat(topic.topicList);

    console.log('rows', this._rows.length, topic.topicList.length);
    
    return (
      <View>
        <NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}/>

        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(this._rows)}
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


});

export default NodeTopicPage;