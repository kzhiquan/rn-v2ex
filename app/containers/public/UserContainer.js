import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userCreators from '../../actions/user';

import UserPage from '../../pages/public/UserPage';

class UserContainer extends React.Component {
  render() {
    return (
      <UserPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    user
  };
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreators, dispatch);
  return {
    userActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);