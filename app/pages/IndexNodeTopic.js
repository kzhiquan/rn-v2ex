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

import LoadingView from '../components/LoadingView'
import AccountContainer from '../containers/AccountContainer'
import { toastShort } from '../utils/ToastUtil';

const propTypes = {
  node : PropTypes.object.isRequired
};

let page = 0;
let rowCount = 0;
let needLoadMore = false;


class IndexNodeTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount");
    const { topicActions, node } = this.props;
    //console.log('topicActions', topicActions, this.props);
    topicActions.topicRequest(false, true, false, node.path);
  }

  onRefresh(){
    const { topicActions, node } = this.props;
    topicActions.topicRequest(true, false, false, node.path);
  }

  renderItem(topic) {
    //console.log('topic:',topic);
    return (
      //<Text>{topic.topic_title}</Text>
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
    /*const newRowCount = this.listView.props.dataSource.getRowCount();
    console.log('newRowCount', newRowCount, rowCount);
    if (newRowCount == rowCount) {
      page += 1;
      console.log('page', page);
      const { topicActions, node } = this.props;
      topicActions.topicRequest(false, false, true, node.path);
    }*/

    const { auth, navigator } = this.props;
    console.log('auth', auth);
    if(auth.user == null){
      toastShort('还未登录，请先登录！');
      navigator.push({
        component : AccountContainer,
        name:'Account'
      })
    }

  }

  onScroll(){
    console.log('onScroll');
  }

  render() {

    console.log('render IndexNodeTopic props', this.props);

    const { node, topic } = this.props;

    if (topic.isLoading){
      return <LoadingView />
    }

    //we should merge the coming topic.topicList into the older topic.topicList
    console.log('rowCount', rowCount, topic.topicList.length);
    
    return (
      <ListView
        initialListSize = {5}
        dataSource={this.state.dataSource.cloneWithRows(topic.topicList)}
        renderRow={this.renderItem}
        renderFooter={this.renderFooter}
        onEndReached={this.onEndReached}
        onScroll={this.onScroll}
        onEndReachedThreshold={-50}
        enableEmptySections={true}
        removeClippedSubviews = {false}
        ref={(listView)=>this.listView = listView}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        refreshControl={
          <RefreshControl
            refreshing={topic.isRefreshing}
            onRefresh={() => this.onRefresh()}
            title="Loading..."
          />
        }
      />
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
    backgroundColor: '#FFF'
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
  }
  ,categoryBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center'
  },
  gridLayout: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2'
  },
  sureBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#3e9ce9'
  },
  btnText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff'
  },
  header: {
    padding: 10,
    backgroundColor: '#fcfcfc'
  }
});

IndexNodeTopic.propTypes = propTypes;

export default IndexNodeTopic;