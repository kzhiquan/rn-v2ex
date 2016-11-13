import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UserPage from '../pages/UserPage';

class UserContainer extends React.Component {
  render() {
    return (
      <UserPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth
  };
};


export default connect(mapStateToProps)(UserContainer);