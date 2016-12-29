import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AirPage from '../../pages/find/AirPage';

class AirContainer extends React.Component {
  render() {
    return (
      <AirPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { nodeList } = state;
  return {
    nodeList,
  };
};


export default connect(mapStateToProps)(AirContainer);