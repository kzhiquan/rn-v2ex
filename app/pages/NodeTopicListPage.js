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
  TextInput,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/AccountContainer';
import SearchContainer from '../containers/SearchContainer';
import TopicContainer from '../containers/TopicContainer';
import { toastShort } from '../utils/ToastUtil';
import VXModal from '../components/VXModal';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class NodeTopicListPage extends React.Component {
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
    page = 1;
    canLoadMore = false;
  }

  componentWillMount() {
    //console.log("componentWillMount");
    //const { topicListActions } = this.props;
    //this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
  }

  _keyboardWillShow(){
    console.log('keyboardWillShow');
    Keyboard.dismiss();
  }

  componentDidMount() {
    //console.log("componentDidMount");
    const { topicListActions, route } = this.props;
    topicListActions.requestTopicList(false, true, false, route.node.path);
  }

  onRefresh(){
    //console.log('onRefresh');
    canLoadMore = false;
    const { topicListActions, route } = this.props;
    topicListActions.requestTopicList(true, false, false, route.node.path);
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
              {topic.node_name ? <Text>{topic.node_name}</Text> : null}
              <Text>{topic.member_name}</Text>
              <Text>{topic.latest_reply_date}</Text>
              <Text>{topic.latest_reply_member_name}</Text>
            </View>
          </View>
          <Text style={styles.itemFooter}>{topic.reply_count}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter(){
    const { topicList } = this.props;
    if(topicList.isLoadingMore){
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

      const { topicListActions, route } = this.props;
      page += 1;
      topicListActions.requestTopicList(false, false, true, route.node.path, page);
      //console.log('in onEndReached page', page);
    }
  }

  onScroll() {
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  _searchBarFocus(event){
    //console.log('_searchBarFocus');
    //this.refs.searchBar.blur();
    //console.log('event', event);

    //event.preventDefault();

    //return false;

    const { navigator } = this.props;
    navigator.push({
      component : SearchContainer,
      name : 'Search',
    });

  }


  render() {
    const { topicList } = this.props;
    //console.log('render NodeTopicPage');
    if (topicList.isLoading){
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
    if(topicList.topicList && route.node.path in topicList.topicList){
      rows = topicList.topicList[route.node.path];
    }
    //console.log('rows', rows.length);
    return (
      <View>

        { (route.node.path == '/recent') ? 
            (<NavigationBar
              title={
                  <TouchableOpacity 
                    onPress={this._searchBarFocus.bind(this)}>
                    <TextInput
                      editable={false}
                      ref="searchBar"
                      returnKeyType="search"  
                      style={{height:40, width: 375-30, borderColor:'gray', borderWidth:1, marginRight:30}}
                    />
                  </TouchableOpacity>}

              rightButton={
                <TouchableOpacity>
                  <Icon name="ios-add" size={30} style={{marginRight:10}} color="blue"/>
                </TouchableOpacity> }
            />)
            :
            (<NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}/>)
        }


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

export default NodeTopicListPage;



