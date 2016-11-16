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


import LoadingView from '../components/LoadingView'
import AccountContainer from '../containers/AccountContainer'
import { toastShort } from '../utils/ToastUtil';


let page = 0;
let rowCount = 0;
let needLoadMore = false;


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
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount");
    const { authActions,auth } = this.props;
    authActions.requestMyTopic(auth.user);
  }

  onRefresh(){
    const { authActions,auth } = this.props;
    authActions.refreshMyTopic(auth.user);
  }

  renderItem(topic) {
    console.log('topic:',topic);
    return (
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
    )
  }

  renderFooter(){


  }

  onEndReached() {


  }

  onScroll(){
    console.log('onScroll');
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
      title: '我的主题',
    };

    let rows = []
    if(auth.myTopic && auth.myTopic.topics){
      rows = auth.myTopic.topics;
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

});


export default MyTopicListPage;