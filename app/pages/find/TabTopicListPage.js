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
import TopicTableItem from '../../components/TopicTableItem';


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

  _onTopicClick(){
    const { topic, navigator } = this;
    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
      topic : topic,
    });
  }

  _onUserClick(){
    console.log("_onUserClick", this);
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'UserPage', 
      path : path,
    });
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
    const { node, topicList } = this.props;
    if(topicList.topicList && node.path in topicList.topicList && topicList.topicList[node.path].length > 0){
      return(
        <Text style={[styles.footerText, styles.metaTextStyle]}>
          ~~end
        </Text>
      )
    }else{
      return null;
    }
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

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },
});


export default TabTopicListPage;

