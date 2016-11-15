import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as topicCreators from '../actions/topic';

import NodeTopicPage from '../pages/NodeTopicPage';

class NodeTopicContainer extends React.Component {
  render() {
    return (
      <NodeTopicPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { topic } = state;
  return {
    topic
  };
};

const mapDispatchToProps = (dispatch) => {
  const topicActions = bindActionCreators(topicCreators, dispatch);
  return {
    topicActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeTopicContainer);