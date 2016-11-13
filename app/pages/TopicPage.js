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
import IndexNodeTopicPage from './IndexNodeTopicPage'


const propTypes = {
  topicActions: PropTypes.object,
  topic: PropTypes.object.isRequired
};

class TopicPage extends React.Component {
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
    //console.log('Topic props', this.props);
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />} 
        >
        
        {
          SITE.INDEX_NODE.map((node, index) => {
            return <IndexNodeTopicPage key={index}  node={node} {...this.props} tabLabel={node.name}/>
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

TopicPage.propTypes = propTypes;

export default TopicPage;