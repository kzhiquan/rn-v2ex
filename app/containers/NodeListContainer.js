import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as nodeListCreators from '../actions/nodeList';

import NodeListPage from '../pages/NodeListPage';

class NodeListContainer extends React.Component {
  render() {
    return (
      <NodeListPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { nodeList } = state;
  return {
    nodeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  const nodeListActions = bindActionCreators(nodeListCreators, dispatch);
  return {
    nodeListActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeListContainer);