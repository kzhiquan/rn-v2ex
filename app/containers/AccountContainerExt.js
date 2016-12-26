import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccountPageExt from '../pages/AccountPageExt';
import * as authCreators from '../actions/auth';

class AccountContainerExt extends React.Component {
  render() {
    return (
      <AccountPageExt {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth,
  };
};


const mapDispatchToProps = (dispatch) => {;
  const authActions = bindActionCreators(authCreators, dispatch);
  return {
    authActions,
  };
};




export default connect(mapStateToProps,mapDispatchToProps)(AccountContainerExt);