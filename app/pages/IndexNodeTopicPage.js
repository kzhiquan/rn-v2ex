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

import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import NodeTopicContainer from '../containers/NodeTopicContainer';
import { toastShort } from '../utils/ToastUtil';
import VXModal from '../components/VXModal';

const propTypes = {
  node : PropTypes.object.isRequired
};

let page = 0;
let rowCount = 0;
let needLoadMore = false;


class IndexNodeTopicPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
      modalVisible: false,
    };
    this.onEndReached = this.onEndReached.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentWillMount() {
    console.log("componentWillMount");
    //const { topicActions } = this.props;
    //topicActions.nodeTopicPageInit();
  }

  componentDidMount() {
    console.log("componentDidMount");
    const { topicActions, node } = this.props;
    topicActions.requestTopic(false, true, false, node.path);
  }

  onRefresh(){
    const { topicActions, node } = this.props;
    topicActions.requestTopic(true, false, false, node.path);
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


  onEndReached() {
    console.log('onEndReached');
    /*const newRowCount = this.listView.props.dataSource.getRowCount();
    console.log('newRowCount', newRowCount, rowCount);
    if (newRowCount == rowCount) {
      page += 1;
      console.log('page', page);
      const { topicActions, node } = this.props;
      topicActions.topicRequest(false, false, true, node.path);
    }*/

    const { auth, navigator, topicActions } = this.props;
    //console.log('auth', auth);
    if(!auth.user){
      this.setState({modalVisible:true});
    }else{
      navigator.push({
        component : NodeTopicContainer,
        name : '最近主题',
        node : {
          name : '最近主题', 
          path : '/recent',
        }
      })
    }

  }

  onScroll(){
    console.log('onScroll');
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

    //console.log('render IndexNodeTopic props', this.props);

    const { node, topic } = this.props;

    if (topic.isLoading){
      return <LoadingView />
    }

    //we should merge the coming topic.topicList into the older topic.topicList
    //console.log('IndexNodeTopicPage rowCount', rowCount, topic.topicList.length);
    let rows = [];
    if(topic.topicList && node.path in topic.topicList){
      rows = topic.topicList[node.path];
    }
    //console.log('rows', rows);
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
});

IndexNodeTopicPage.propTypes = propTypes;

export default IndexNodeTopicPage;