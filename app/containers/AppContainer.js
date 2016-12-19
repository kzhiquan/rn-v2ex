import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppPage from '../pages/AppPage';

class AppContainer extends React.Component {
  render() {
    return (
      <AppPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth
  };
};


export default connect(mapStateToProps)(AppContainer);