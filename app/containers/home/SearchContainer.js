import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as searchCreators from '../../actions/search';

import SearchPage from '../../pages/home/SearchPage';

class SearchContainer extends React.Component {
  render() {
    return (
      <SearchPage {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { search } = state;
  return {
    search,
  };
};

const mapDispatchToProps = (dispatch) => {
  const searchActions = bindActionCreators(searchCreators, dispatch);
  return {
    searchActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);