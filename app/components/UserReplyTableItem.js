import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';


import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';

class UserReplyTableItem extends React.Component {
  constructor(props){
    super(props);
  }


  _renderNode(node, index, parent, type) {
    if (node.name === 'img') {
        let uri = node.attribs.src;
        if(uri.indexOf('http') == -1){
          uri = 'http:' + uri;
        }

        return (
          <View key={index} style={{flex:1, flexDirection:'row', justifyContent: 'center', width:maxWidth, height:maxWidth,}}>
            <Image 
              source={{uri:uri}} 
              style={{
                width:maxWidth-30,
                height:maxWidth-30,
                resizeMode: Image.resizeMode.contain}} />
          </View>
        )
    }
  }

  _onLinkPress(url){
    console.log('url', url);
  }

  render() {
    const { reply } = this.props;

    return (
      <TouchableOpacity onPress={this.props.onTopicClick}>
        
        <View style={[styles.userReplyItemContainer, ]}>

            <Image
              style={styles.avatar_size_42}
              source={{uri:reply.member_avatar}}
            />
            <View style={styles.avatarRightContent}>

              <View>
                <Text style={{fontSize:16}}>{reply.member_name}</Text>
              </View>

              <View style={{paddingTop:8}}>
                <Text style={styles.metaTextStyle}>{reply.date}</Text>
              </View>

              <View style={{paddingTop:6}}>
                <Text style={{fontSize:14}}>{reply.topic.topic_title}</Text>
              </View>
              <View>
                <Image
                  style={{left:32}}
                  source={require('../static/imgs/triangle.png')}
                  />
                <View style={{backgroundColor:'#F2F2F2', borderRadius:2, paddingTop:2, paddingBottom:2, paddingRight:4, paddingLeft:4}}>
                  <HtmlRender
                    value={'<div>' + reply.content + '</div>'}
                    onLinkPress={this._onLinkPress.bind(this)}
                    renderNode={this._renderNode}
                  />
                </View>
              </View>

            </View>
        </View>
      </TouchableOpacity>
    )
  }
}

UserReplyTableItem.propTypes = {
  onTopicClick: React.PropTypes.func,
  reply: React.PropTypes.object,
};

const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = 'white';

var styles = StyleSheet.create({

  userReplyItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
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
});


export default UserReplyTableItem;