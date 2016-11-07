import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as topicCreators from '../actions/topic';

import Topic from '../pages/Topic';

class TopicContainer extends React.Component {
  render() {
    return (
      <Topic {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { topic, auth } = state;
  return {
    topic,
    auth
  };
};

const mapDispatchToProps = (dispatch) => {
  const topicActions = bindActionCreators(topicCreators, dispatch);
  return {
    topicActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicContainer);