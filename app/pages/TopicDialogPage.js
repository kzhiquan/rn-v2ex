import React, { PropTypes } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  ScrollView,
  RefreshControl,
  Alert,
  ListView,
  Image,
  ActivityIndicator,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import HTMLView from 'react-native-htmlview';
import HtmlRender from 'react-native-html-render';
import UserContainer from '../containers/public/UserContainer';

class TopicDialogPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
      replyMoreModalVisible : false,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
  }

  _renderNode(node, index, parent, type) {
    //console.log('node:',node);
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
                /*<ResizableImage 
                    source={{uri:uri}}
                    style={{}} />*/
        )

    }
  }

  _onLinkPress(url){
    console.log('url', url);
  }

  _userClick(){
    const { navigator, path } = this;
    navigator.push({
      component : UserContainer,
      name : 'User', 
      path : path,
    });
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }

  renderItem(reply, sectionID, rowID, highlightRow) {
    /*return (
        <View style={styles.containerReply}>
          <TouchableOpacity onPress={this._userClick} navigator={navigator} path={item.member_url}>
            <Image style={styles.replyHeader} source={{uri:item.member_avatar}} />
          </TouchableOpacity>
          <View style={styles.replyBody}>
            <HtmlRender
              key={`${sectionID}-${rowID}`}
              value={'<div>' + item.content + '</div>'}
              stylesheet={topicTitleStyle}
              onLinkPress={this._onLinkPress.bind(this)}
              renderNode={this._renderNode}
            />
            <View style={styles.replyBodyDetail}>
              <Text>{item.member_name}</Text>
            </View>
          </View>
          <Text style={styles.replyFooter}>{item.floor_number}</Text>
        </View>
    );*/
    return (
        <View style={styles.replyItemContainer}>
            <Image
              style={styles.avatar_size_42}
              source={{uri:reply.member_avatar}}
            />

            <View style={styles.avatarRightContent}>

              <View>
                <Text style={{fontSize:16}}>{reply.member_name}</Text>
              </View>

              <View style={[styles.directionRow, {paddingTop:8,}]}>

                <View>
                  <Text style={styles.metaTextStyle}>{reply.post_date}</Text>
                </View>

                <Image
                  style={{top:4,left:4}}
                  source={require('../static/imgs/dot.png')}
                />

                <View style={{left:14}}>
                  <Text style={styles.metaTextStyle}>{reply.floor_number+'楼'}</Text>
                </View>

              </View>

              <View style={{paddingTop:8,}}>
                <HTMLView
                  value={'<div>' + reply.content + '</div>'}
                  stylesheet={{fontSize:14}}
                />
              </View>
            </View>
        </View>
    )
  }

  render() {
    const { navigator, route } = this.props;
    //console.log('this.props:', this.props);
    let titleConfig = {
      title: '对话内容'
    };

    //console.log('route.reply.content', unescape(route.reply.content), route.reply.content.match(/@<a href="\/member\/(.+)">/ig))
    let pattern = /@<a href="\/member\/[^"]*">([^<]*)<\/a> /g;
    let matches = pattern.exec(route.reply.content);
    let user_names = [];
    while(matches){
      //console.log('matches', matches);
      user_names.push(matches[1]);
      matches = pattern.exec(route.reply.content);
      //console.log('2->matches', matches);
    }
    user_names.push(route.reply.member_name);
    //console.log('user_names:', user_names);
    let rows = [];


    //try to find an algorith to get dialog
    for (let reply of route.wrapList.list){

      let index = user_names.findIndex(function(value, index, arr){
        return (value == reply.member_name );
      });

      console.log(reply, index);

      if(index >= 0){
        rows.push(reply);
      }

      if(reply.floor_number === route.reply.floor_number){
        break;
      }
    }

    //console.log('rows', rows);

    return (
      <View style={styles.container}>
        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          leftButton={
            <TouchableOpacity onPress={this._onBackClick.bind(this)}>
                <Image style={{left:12, top:11}} source={require('../static/imgs/back_arrow.png')}/>
            </TouchableOpacity> 
          }
          statusBar={{
            tintColor : '#FAFAFA'
          }}
        />

        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(rows)}
          renderRow={this.renderItem.bind(this)}
          enableEmptySections={true}
          removeClippedSubviews = {false}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        />
      </View>

    );
  }

}


const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#A0ADB8';
let backgroundColor = 'white';


const styles = StyleSheet.create({


  container : {
    flex : 1,
    backgroundColor : 'white',
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : '#B2B2B2',
  },


  replyItemContainer:{
    flexDirection : 'row',
    flex : 1, 
    paddingTop:12, 
    left:16, 
    paddingBottom:10, 
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
    paddingBottom: 8,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42,
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

  directionRow:{
    flexDirection : 'row',
  },



  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  containerReply:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  replyHeader:{
    width:48,
    height:48
  },
  replyBody:{
    width:280
  },
  replyBodyDetail:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  replyFooter:{
    color:'blue',
    paddingTop: 18
  },


});


const topicTitleStyle = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
});


export default TopicDialogPage;

