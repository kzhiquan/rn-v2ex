import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as newTopicCreators from '../../actions/newTopic';

import NewTopicNodePage from '../../pages/home/NewTopicNodePage';

class NewTopicNodeContainer extends React.Component {
  render() {
    return (
      <NewTopicNodePage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { newTopic } = state;
  return {
    newTopic,
  };
};

const mapDispatchToProps = (dispatch) => {
  const newTopicActions = bindActionCreators(newTopicCreators, dispatch);
  return {
    newTopicActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTopicNodeContainer);