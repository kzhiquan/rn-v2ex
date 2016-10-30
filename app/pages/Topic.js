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



const propTypes = {
  topicActions: PropTypes.object,
  topic: PropTypes.object.isRequired
};

class Topic extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  render() {
    const { navigator, route } = this.props;
    return (
      <View style={styles.container}>
        <Text>topic page</Text>
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

Topic.propTypes = propTypes;

export default Topic;