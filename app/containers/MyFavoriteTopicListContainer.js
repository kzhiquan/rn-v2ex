import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authCreators from '../actions/auth';

import MyFavoriteTopicListPage from '../pages/MyFavoriteTopicListPage';


class MyFavoriteTopicListContainer extends React.Component {
  render() {
    return (
      <MyFavoriteTopicListPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth
  };
};

const mapDispatchToProps = (dispatch) => {
  const authActions = bindActionCreators(authCreators, dispatch);
  return {
    authActions,
  };
};


export default connect(mapStateToProps,mapDispatchToProps)(MyFavoriteTopicListContainer);