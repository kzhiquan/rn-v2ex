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
import { toastShort } from '../utils/ToastUtil';


let page = 0;
let rowCount = 0;
let needLoadMore = false;


class MyReplyListPage extends React.Component {
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
    const { authActions,auth } = this.props;
    authActions.requestMyReply(auth.user);
  }

  onRefresh(){
    const { authActions,auth } = this.props;
    authActions.refreshMyReply(auth.user);
  }

  renderItem(reply) {
    //console.log('reply:',reply);
    if(!reply.title){
      return null;
    }
    
    return (
      <View style={styles.containerItem}>

        <View>
          <View><Text>{reply.date}:{reply.title}</Text></View>
        </View>

        <View>
          <Text>{reply.content}</Text>
        </View>

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
      title: '我的回复',
    };

    let rows = []
    if(auth.myReply && auth.myReply.replies){
      rows = auth.myReply.replies;
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
    flexDirection:'column',
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


export default MyReplyListPage;


