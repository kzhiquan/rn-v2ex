import React, { PropTypes } from 'react';


import TopicListTableViewExt from './TopicListTableViewExt'


class UserTopicListTableView extends TopicListTableViewExt {
  
  _onUserClick(topic){
    super._onTopicClick(topic);
  }
  
}


export default UserTopicListTableView;



