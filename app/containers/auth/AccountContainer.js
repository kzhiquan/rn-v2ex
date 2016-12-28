import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';



import * as accountsCreators from '../../actions/account';
import * as authCreators from '../../actions/auth';
import AccountPage from '../../pages/auth/AccountPage';

class AccountContainer extends React.Component {
  render() {
    //console.log('render AccountContainer', this.props);
    return (
      <AccountPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { account, auth } = state;
  return {
    account,
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  const accountActions = bindActionCreators(accountsCreators, dispatch);
  const authActions = bindActionCreators(authCreators, dispatch);
  return {
    accountActions,
    authActions,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);