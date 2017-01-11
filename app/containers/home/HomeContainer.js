import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authCreators from '../../actions/auth';
import * as recentCreators from '../../actions/recent';

import HomePage from '../../pages/home/HomePage';

class HomeContainer extends React.Component {
  render() {
    return (
      <HomePage {...this.props} />
    );
  }
}


const mapStateToProps = (state) => {
  const { auth, recent } = state;
  return {
    auth, 
    recent,
  };
};

const mapDispatchToProps = (dispatch) => {
  const recentActions = bindActionCreators(recentCreators, dispatch);
  const authActions = bindActionCreators(authCreators, dispatch);
  return {
    recentActions,
    authActions,
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);