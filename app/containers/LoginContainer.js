import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoginPage from '../pages/LoginPage';

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


export default connect(mapStateToProps)(LoginContainer);