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


import AccountContainer from '../../containers/auth/AccountContainer';
import TopicContainer from '../../containers/TopicContainer';
import UserContainer from '../../containers/UserContainer';
import TopicTableItem from '../../components/TopicTableItem';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;


class MyFocusPersonTopicListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
    };
    canLoadMore = false;
    page = 1;
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { authActions, auth, route } = this.props;
    authActions.requestMyFocusPerson(route.node.path);
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { authActions, auth, route } = this.props;
    authActions.refreshMyFocusPerson(route.node.path);
  }

  _onTopicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
      topic : topic,
    });
  }

  _onUserClick(){
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'UserPage', 
      path : path,
    });
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }

  renderItem(topic) {
    const { navigator } = this.props;
      return (
        <TopicTableItem 
          topic = {topic}
          navigator = {navigator}
          onTopicClick = {this._onTopicClick}
          onUserClick = {this._onUserClick}
        />
      )
  }

  renderFooter(){
    const { auth } = this.props;
    if(auth.myFavoriteTopic.isLoadingMore){
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
    if(auth.myFavoriteTopic.topicList.length % countPerPage === 0){
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

      const { authActions, auth, route } = this.props;
      if(this._isCurrentPageFilled()){
        page += 1;
      }
      authActions.requestMoreFocusPerson(route.node.path, page);
    }
  }

  onScroll(){
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  render() {
    const { navigator, auth, route} = this.props;

    var titleConfig = {
      title: route.node.name,
    };

    let rows = []
    if(auth.myFocusPerson && auth.myFocusPerson.topicList){
      rows = auth.myFocusPerson.topicList;
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
            statusBar={{
              tintColor : '#FAFAFA'
            }}
          />

          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(rows)}
            renderRow={this.renderItem.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            onScroll={this.onScroll.bind(this)}
            onEndReachedThreshold={-20}
            enableEmptySections={true}
            removeClippedSubviews = {false}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            refreshControl={
              <RefreshControl
                refreshing={auth.myFocusPerson.isRefreshing}
                onRefresh={() => this.onRefresh()}
                title="Loading..."
              />
            }
          />

          <ActivityIndicator
            animating={ auth.myFocusPerson.isLoading }
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
  front:{
      position: 'absolute',
      top:300,
      left: (width-50)/2,
      width: 50,
      height:50,
      zIndex: 1,
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

  //custom
  container : {
    flex : 1,
    backgroundColor : backgroundColor,
  },


  avatarRightContent:{
    left:10,
    width : width-12-10-16-42-10,
  },
  
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },
});


export default MyFocusPersonTopicListPage;