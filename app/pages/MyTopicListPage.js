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


import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import TopicContainer from '../containers/TopicContainer';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyTopicListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
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
    //console.log("componentDidMount");
    const { authActions,auth } = this.props;
    authActions.requestMyTopic(auth.user);
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { authActions,auth } = this.props;
    authActions.refreshMyTopic(auth.user);
  }

  _topicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'Topic',
      topic : topic,
    });
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }

  renderItem(topic) {
    //console.log('topic:',topic);
    const { navigator } = this.props;
    return (
      <TouchableOpacity onPress={this._topicClick} topic={topic} navigator={navigator}>
        <View style={styles.containerItem}>
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

  _isCurrentPageFilled(countPerPage=20){
    const { auth } = this.props;

    if(auth.myTopic.topicList.length % countPerPage === 0){
      return true;
    }else{
      return false;
    }
  }

  onEndReached() {
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;

      const { authActions, auth } = this.props;
      if(this._isCurrentPageFilled()){
        page += 1;
      }
      authActions.requestMoreMyTopic(auth.user, page);
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
      title: '我的主题',
    };

    let rows = []
    if(auth.myTopic && auth.myTopic.topicList){
      rows = auth.myTopic.topicList;
    }

    return (
      <View style={styles.container}>

          <NavigationBar
            style={styles.navigatorBarStyle}
            title={titleConfig}
            leftButton={
              <TouchableOpacity onPress={this._onBackClick.bind(this)}>
                  <Image style={{left:12, top:11}} source={require('../static/imgs/back_arrow.png')}/>
              </TouchableOpacity> 
            }
          />

          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(rows)}
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
let backgroundColor = '#EFEFF4';

const styles = StyleSheet.create({

  containerItem:{
    flex:1,
    flexDirection:'row',
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

  //common
  directionRow:{
    flexDirection : 'row',
  },

  avatar_size_42:{
    width:42,
    height:42,
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

  /*accountMetaContainer:{
    backgroundColor:'white', 
    paddingTop:12,
    paddingLeft:16,
    paddingBottom:12,
  },
  avartarMetaContainer:{
    paddingLeft:10,
    justifyContent:'space-between',
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },


  //table css
  headerSection :{
      height: 16,
      //borderBottomWidth:1, 
      //borderTopColor:'#B2B2B2',
      //borderTopWidth:1,
    //borderBottomColor:'#B2B2B2',
  },

  sectionBorder:{
    borderBottomWidth:1, 
    borderBottomColor:borderColor,
  },

  firstCellContainer:{
    backgroundColor:'white',
    borderTopWidth : 1,
    borderTopColor : borderColor,
  },
  lastCellContainer:{
    backgroundColor:'white',
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },
  cellStyle:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:cellBorderColor,
    height:60,
    marginLeft:16,
  },*/

});


export default MyTopicListPage;