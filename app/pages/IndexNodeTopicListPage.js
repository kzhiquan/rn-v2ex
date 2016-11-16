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
} from 'react-native';

import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import NodeTopicListContainer from '../containers/NodeTopicListContainer';
import TopicContainer from '../containers/TopicContainer';
import { toastShort } from '../utils/ToastUtil';
import VXModal from '../components/VXModal';


let page = 0;
let rowCount = 0;
let needLoadMore = false;

class IndexNodeTopicListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
      modalVisible: false,
    };
    this.onEndReached = this.onEndReached.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const { topicListActions, node } = this.props;
    topicListActions.requestTopicList(false, true, false, node.path);
  }

  onRefresh(){
    const { topicListActions, node } = this.props;
    topicListActions.requestTopicList(true, false, false, node.path);
  }

  _topicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'Topic',
      topic : topic,
    });
  }

  renderItem(topic) {
    const { navigator } = this.props;
    return (
      <TouchableOpacity onPress={this._topicClick} topic={topic} navigator={navigator}>
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
      </TouchableOpacity>

    )
  }


  onEndReached() {
    const { auth, navigator } = this.props;
    if(!auth.user){
      this.setState({modalVisible:true});
    }else{
      navigator.push({
        component : NodeTopicListContainer,
        name : '最近主题',
        node : {
          name : '最近主题', 
          path : '/recent',
        }
      });
    }
  }

  _onModalClick(){
    const { navigator } = this.props;
    this.setState({modalVisible:false});
    navigator.push({
        component : AccountContainer,
        name:'Account'
    });
  }

  render() {
    const { node, topicList } = this.props;

    if (topicList.isLoading){
      return <LoadingView />
    }

    let rows = [];
    if(topicList.topicList && node.path in topicList.topicList){
      rows = topicList.topicList[node.path];
    }
    return (
      <View>
        <VXModal
          visible={this.state.modalVisible}
          title={'尚未登录，请先登录'}
          btnText={'确定'}
          btnClick={ this._onModalClick.bind(this) }
        />
        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(rows)}
          renderRow={this.renderItem}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={-50}
          enableEmptySections={true}
          removeClippedSubviews = {false}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          refreshControl={
            <RefreshControl
              refreshing={topicList.isRefreshing}
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
});


export default IndexNodeTopicListPage;

