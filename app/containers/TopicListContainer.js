import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as topicListCreators from '../actions/topicList';

import TopicListPage from '../pages/TopicListPage';

class TopicListContainer extends React.Component {
  render() {
    return (
      <TopicListPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { topicList, auth } = state;
  return {
    topicList,
    auth
  };
};

const mapDispatchToProps = (dispatch) => {
  const topicListActions = bindActionCreators(topicListCreators, dispatch);
  return {
    topicListActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicListContainer);