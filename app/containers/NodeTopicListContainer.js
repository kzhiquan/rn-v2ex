import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as topicListCreators from '../actions/topicList';

import NodeTopicListPage from '../pages/NodeTopicListPage';

class NodeTopicListContainer extends React.Component {
  render() {
    return (
      <NodeTopicListPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { topicList } = state;
  return {
    topicList
  };
};

const mapDispatchToProps = (dispatch) => {
  const topicListActions = bindActionCreators(topicListCreators, dispatch);
  return {
    topicListActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeTopicListContainer);