import React, { PropTypes } from 'react';


import TopicContainer from '../containers/TopicContainer';
import TableView from './TableView'
import UserReplyTableItem from './UserReplyTableItem';


class UserReplyListTableView extends TableView {
  
  _onTopicClick(reply){
    const { navigator } = this.props;
    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
      topic : reply.topic,
    });
  }

  renderItem(reply) {
      return (
        <UserReplyTableItem 
          reply = {reply}
          onTopicClick = {()=>this._onTopicClick(reply)}
        />
      )
  }
  
}

UserReplyListTableView.propTypes = {
  navigator : React.PropTypes.object,
};


export default UserReplyListTableView;



