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
} from 'react-native';

import LoadingView from '../components/LoadingView'

const propTypes = {
  node : PropTypes.object.isRequired
};

class IndexNodeTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.topic_url !== r2.topic_url } )
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { topicActions } = this.props;
    //console.log('topicActions', topicActions, this.props);
    topicActions.topicRequest(false, true);
  }

  onRefresh(){
    const { topicActions } = this.props;
    topicActions.topicRequest(true, false);
  }

  renderItem(topic) {
    console.log('topic:',topic);
    return (
      //<Text>{topic.topic_title}</Text>
      <View>
        <Image source={{uri:topic.member_avatar}} />
        <View>
          <Text>{topic.topic_title}</Text>
          <View>
            <Text>{topic.node_name}</Text>
            <Text>{topic.member_name}</Text>
            <Text>{topic.date}</Text>
            <Text>{topic.latest_reply_member_name}</Text>
          </View>
        </View>
        <Text>{topic.reply_count}</Text>
      </View>
    )
  }

  render() {

    console.log('render IndexNodeTopic props', this.props);

    const { node, topic } = this.props;

    if (topic.isLoading){
      return <LoadingView />
    }

    //we should merge the coming topic.topicList into the older topic.topicList

    return (
      <ListView
        initialListSize = {1}
        dataSource={this.state.dataSource.cloneWithRows(topic.topicList)}
        renderRow={this.renderItem}
        enableEmptySections={true}
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
  categoryBtn: {
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