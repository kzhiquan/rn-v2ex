import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as accountsCreators from '../actions/account';
import EditAccount from '../pages/EditAccount';

class EditAccountContainer extends React.Component {
  render() {
    //console.log('render AddAccountContainer', this.props);
    return (
      <EditAccount {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { account } = state;
  return {
    account
  };
};

const mapDispatchToProps = (dispatch) => {
  const accountActions = bindActionCreators(accountsCreators, dispatch);
  return {
    accountActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountContainer);