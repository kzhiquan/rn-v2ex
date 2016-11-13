import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';



import * as accountsCreators from '../actions/account';
import AccountPage from '../pages/AccountPage';

class AccountContainer extends React.Component {
  render() {
    //console.log('render AccountContainer', this.props);
    return (
      <AccountPage {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);