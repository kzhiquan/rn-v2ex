import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoginPage from '../../pages/auth/LoginPage';
import * as authCreators from '../../actions/auth';

class LoginContainer extends React.Component {
  render() {
    return (
      <LoginPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth
  };
};

const mapDispatchToProps = (dispatch) => {;
  const authActions = bindActionCreators(authCreators, dispatch);
  return {
    authActions,
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);