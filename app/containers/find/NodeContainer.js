import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as nodeCreators from '../../actions/node';

import NodePage from '../../pages/find/NodePage';

class NodeContainer extends React.Component {
  render() {
    return (
      <NodePage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { node } = state;
  return {
    node,
  };
};

const mapDispatchToProps = (dispatch) => {
  const nodeActions = bindActionCreators(nodeCreators, dispatch);
  return {
    nodeActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeContainer);