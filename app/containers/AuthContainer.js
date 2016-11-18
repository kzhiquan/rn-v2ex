import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AuthPage from '../pages/AuthPage';

class AuthContainer extends React.Component {
  render() {
    return (
      <AuthPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth
  };
};


export default connect(mapStateToProps)(AuthContainer);