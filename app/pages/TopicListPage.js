import React, { PropTypes } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import SITE from '../constants/Config'
import IndexNodeTopicListPage from './IndexNodeTopicListPage'


class TopicListPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount")
  }

  render() {
    const { navigator, route } = this.props;
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />} 
        >
        
        {
          SITE.INDEX_NODE.map((node, index) => {
            return <IndexNodeTopicListPage key={index}  node={node} {...this.props} tabLabel={node.name}/>
          })
        }

      </ScrollableTabView>
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
});

export default TopicListPage;




