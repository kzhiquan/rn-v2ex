import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
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

import TopicContainer from '../../containers/TopicContainer';
import UserContainer from '../../containers/public/UserContainer';
import TopicTableItem from '../../components/TopicTableItem';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;

class NodeTopicListPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
    };
    page = 1;
    canLoadMore = false;
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  onRefresh(){
    canLoadMore = false;
    const { nodeActions, node, currentNode } = this.props;
    if(currentNode.path){
      nodeActions.refreshNodePage(currentNode);
    }
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
    const { node } = this.props;
    if(node.isLoadingMore){
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
    const { nodeActions, currentNode} = this.props;
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1 && currentNode.path) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
      page += 1;
      nodeActions.requestMoreNodePage(currentNode, page);
    }
  }

  onScroll() {
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  render() {

    const { node } = this.props;
    let rows = this.props.topicList;

    return (
        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(rows)}
          renderRow={this.renderItem.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          onScroll={this.onScroll.bind(this)}
          onEndReachedThreshold={-50}
          enableEmptySections={true}
          removeClippedSubviews = {false}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          refreshControl={
            <RefreshControl
              refreshing={node.isRefreshing}
              onRefresh={() => this.onRefresh()}
              title="Loading..."
            />
          }
        />
    );


  }
}

const styles = StyleSheet.create({
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



