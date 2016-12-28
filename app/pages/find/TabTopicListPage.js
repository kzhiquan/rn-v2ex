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

import AccountContainer from '../../containers/auth/AccountContainer';
import NodeTopicListContainer from '../../containers/NodeTopicListContainer';
import TopicContainer from '../../containers/TopicContainer';
import UserContainer from '../../containers/UserContainer';


let page = 0;
let rowCount = 0;
let needLoadMore = false;

class TabTopicListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
    };
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

  _userClick(){
    console.log('user click');
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'User', 
      path : path,
    });
  }

  renderItem(topic) {
    const { navigator } = this.props;
    return (
      <TouchableOpacity onPress={this._topicClick} topic={topic} navigator={navigator}>
        <View style={styles.containerItem}>
          <TouchableOpacity onPress={this._userClick} navigator={navigator} path={topic.member_url}>
              <Image style={styles.itemHeader} source={{uri:topic.member_avatar}} />
          </TouchableOpacity>
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

  renderFooter(){
    return(
      <Text style={styles.footerText}>
        end
      </Text>
    )
  }

  render() {
    const { node, topicList } = this.props;

    let rows = [];
    if(topicList.topicList && node.path in topicList.topicList){
      rows = topicList.topicList[node.path];
    }
    return (
      <View>

        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(rows)}
          renderRow={this.renderItem.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
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
        <ActivityIndicator
          animating={ topicList.isLoading }
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

  //custom
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

  topicItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
    paddingRight:12,
  },

  nodeAreaContainer:{
    backgroundColor:'#E8F0FE', 
    borderRadius:3, 
    paddingTop:2, 
    paddingBottom:2, 
    paddingLeft:7, 
    paddingRight:7,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },




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


export default TabTopicListPage;

