import React, { PropTypes } from 'react';


import TopicContainer from '../containers/public/TopicContainer';
import UserContainer from '../containers/public/UserContainer';
import TopicTableItem from './TopicTableItem';
import TableView from './TableView'


class TopicListTableViewExt extends TableView {
  
  
  _onTopicClick(topic){
    const { navigator } = this.props;
    navigator.push({
      component : TopicContainer,
      name : 'TopicPage',
      topic : topic,
    });

    this.props.onClick && this.props.onClick();
  }

  _onUserClick(topic){
    const { navigator } = this.props;
    navigator.push({
      component : UserContainer,
      name : 'UserPage', 
      path : topic.member_url,
    });

    this.props.onClick && this.props.onClick();
  }


  renderItem(topic) {
    const { navigator } = this.props;
      return (
        <TopicTableItem 
          topic = {topic}
          onTopicClick = {()=>this._onTopicClick(topic)}
          onUserClick = {()=>this._onUserClick(topic)}
        />
      )
  }
  
}

TopicListTableViewExt.propTypes = {
  navigator : React.PropTypes.object,
  onClick : React.PropTypes.func,
};


export default TopicListTableViewExt;



