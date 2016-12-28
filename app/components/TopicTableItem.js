import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';



class TopicTableItem extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const { navigator, topic } = this.props;

    return (
      <TouchableOpacity onPress={this.props.onTopicClick} topic={topic} navigator={navigator}>
        <View style={styles.topicItemContainer}>
            <TouchableOpacity onPress={this.props.onUserClick} navigator={navigator} path={topic.member_url}>
              <Image
                style={styles.avatar_size_42}
                source={{uri:topic.member_avatar}}
              />
            </TouchableOpacity>

            <View style={styles.avatarRightContent}>

              <View>
                <Text style={{fontSize:16}}>{topic.member_name}</Text>
              </View>

              <View style={[styles.directionRow, {paddingTop:4,}]}>
                <View style={styles.nodeAreaContainer}>
                  <Text style={styles.metaTextStyle}>{topic.node_name}</Text>
                </View>
                <View style={[styles.directionRow, {left:10, paddingTop:2}]}>
                  <Text style={styles.metaTextStyle}>{topic.reply_count}</Text>
                  <Image
                    style={{bottom:3}}
                    source={require('../static/imgs/chatbubble.png')}
                  />
                </View>
              </View>

              <View style={{paddingTop:4,}}>
                <Text style={{fontSize:16}}>{topic.topic_title}</Text>
              </View>

              <View style={[styles.directionRow, {paddingTop:4,}]}>
                <View>
                  <Text style={styles.metaTextStyle}>{topic.latest_reply_date}</Text>
                </View>
                <Image
                  style={{top:4,left:4}}
                  source={require('../static/imgs/dot.png')}
                />
                <View style={{left:14}}>
                  <Text style={styles.metaTextStyle}>{'最后回复' + topic.latest_reply_member_name}</Text>
                </View>
              </View>

            </View>
        </View>
      </TouchableOpacity>
    );
  }
}

TopicTableItem.propTypes = {
  onTopicClick: React.PropTypes.func,
  onUserClick : React.PropTypes.func,
  navigator : React.PropTypes.object,
  topic: React.PropTypes.object,
};

const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = 'white';

var styles = StyleSheet.create({
 //common
  directionRow:{
    flexDirection : 'row',
  },

  avatar_size_42:{
    width:42,
    height:42,
    borderRadius:8,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42-10,
  },

  topicItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
    paddingRight:12,
  },

  nodeAreaContainer:{
    backgroundColor:'#E8F0FE', 
    borderRadius:3, 
    paddingTop:2, 
    paddingBottom:2, 
    paddingLeft:7, 
    paddingRight:7,
  },

});


export default TopicTableItem;