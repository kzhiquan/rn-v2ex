import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as accountsCreators from '../actions/account';
import AddAccount from '../pages/AddAccount';

class AddAccountContainer extends React.Component {
  render() {
    //console.log('render AddAccountContainer', this.props);
    return (
      <AddAccount {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddAccountContainer);