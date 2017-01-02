import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import NavigationBar from 'react-native-navbar';

import NodeTopicListPage from './NodeTopicListPage';
import NodeListTableView from '../../components/NodeListTableView'


class NodePage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //console.log("componentWillMount");
    //let { node, route } = this.props;
    //node.currentNode = null;
  }

  componentDidMount() {
    //console.log("componentDidMount")
    const { nodeActions, route } = this.props;
    nodeActions.requestNodePage(route.currentNode);
  }

  _onBackClick(){
    const { navigator, nodeActions } = this.props;
    nodeActions.popNodePageStack();
    navigator.pop();
  }

  _onParentNodeClick(){
    console.log('_onParentNodeClick');
  }

  _onFavoriteNodeClick(){

    //console.log('_onFavoriteNodeClick');
    const { that, node } =  this;
    const { nodeActions } = that.props;

    nodeActions.requestFavoriteNode(node);

  }

  _renderScrollTableBar(){
    return (
      <ScrollableTabBar 
        tabStyle={{paddingLeft:16, paddingRight:16,}}
        tabsContainerStyle={{justifyContent:'center',}}
      />
    )
  }

  _renderNodeMeta(currentNode){

    let nodeOperation = '收藏';
    let favoriteBtnStyle = styles.favoriteBtnStyle;
    let favoriteTextStyle = styles.whiteBoldFontStyle;
    if(currentNode.favorite_url && currentNode.favorite_url.indexOf('unfavorite') >= 0){
      nodeOperation = '已收藏';
      favoriteBtnStyle = [favoriteBtnStyle, {backgroundColor: '#F2F2F2'}];
      favoriteTextStyle = [favoriteTextStyle, {color:'#AEAEAE'}]
    }

    return (
        <View style={styles.nodeMetaContainer}>

          <View style={styles.directionRow}>

              <Image
                style={styles.avatar_size_42}
                source={{uri:currentNode.avatar_url}}
              />

              <View style={styles.avatarRightContent}>

                <View style={[styles.directionRow,{justifyContent:'space-between'}]}>
                    
                    <View>

                      <View>
                        <Text style={{fontSize:16}}>{currentNode.name}</Text>
                      </View>

                      <View style={[styles.directionRow, {paddingTop:4,}]}>

                        <TouchableOpacity
                          onPress={this._onParentNodeClick}
                          node={currentNode.parentNode}
                          that={this}>
                            <View style={styles.nodeAreaContainer}>
                              <Text style={styles.metaTextStyle}>{currentNode.parentNode.name}</Text>
                            </View>
                        </TouchableOpacity>


                        <View style={[styles.directionRow, {left:10, paddingTop:2}]}>
                          <Text style={styles.metaTextStyle}>{currentNode.topic_count}</Text>
                          <Image
                            style={{bottom:3}}
                            source={require('../../static/imgs/chatbubble.png')}
                          />
                        </View>

                      </View>

                    </View>

                    <TouchableOpacity 
                      onPress={this._onFavoriteNodeClick}
                      node={currentNode}
                      that={this}>
                        <View style={favoriteBtnStyle}>
                          <Text style={favoriteTextStyle}>{nodeOperation}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

              </View>

          </View>

          <View style={{top:12,paddingRight:12}}>
            <Text style={{fontSize:16}}>{currentNode.words}</Text>
          </View>

        </View>
    )
  }

  render() {
    const { node, route } = this.props;

    let titleConfig = {
      title: route.currentNode.name
    };

    let currentNode = {
      topicList : [],
      parentNode : {},
      related_nodeList : [],
      child_nodeList : [],
    }

    if(node.nodePageStack.length >= 1){
      currentNode = node.nodePageStack[node.nodePageStack.length-1];
    }

    return (
      <View style={styles.container}>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          leftButton={
            <TouchableOpacity onPress={this._onBackClick.bind(this)}>
                <Image style={{left:12, top:11}} source={require('../../static/imgs/back_arrow.png')}/>
            </TouchableOpacity> 
          }
          statusBar={{tintColor : '#FAFAFA'}}
        />

        {this._renderNodeMeta(currentNode)}

        <ScrollableTabView
          initialPage={0}
          tabBarTextStyle={{fontSize:16}}
          tabBarActiveTextColor={'black'}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={this._renderScrollTableBar.bind(this)}
          >

          <NodeTopicListPage {...this.props} currentNode={currentNode} topicList={currentNode.topicList} key={0} tabLabel={'主题'} />
          <NodeListTableView navigator={this.props.navigator} nodeList={currentNode.related_nodeList} tabLabel={'相关节点'} />
          <NodeListTableView navigator={this.props.navigator} nodeList={currentNode.child_nodeList} tabLabel={'子节点'} />
        
        </ScrollableTabView>

        <ActivityIndicator
          animating={ node.isLoading }
          style={styles.front}
          size="large"
        />

      </View>

    );
  }
}

const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = '#EFEFF4';
let tabBarUnderlineColor = '#007AFF';

const styles = StyleSheet.create({

  directionRow:{
    flexDirection : 'row',
  },

  container : {
    flex : 1,
    backgroundColor : 'white',
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

  tabBarUnderlineStyle:{
    backgroundColor : tabBarUnderlineColor,
    height:2,
  },

  front:{
      position: 'absolute',
      top:300,
      left: (width-50)/2,
      width: 50,
      height:50,
      zIndex: 1,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42,
  },

  avatar_size_42:{
    width:42,
    height:42,
  },

  favoriteBtnStyle:{
    backgroundColor:'#45CB7F', 
    height: 32,
    borderRadius:5, 
    paddingTop:8, 
    paddingBottom:4, 
    paddingLeft:24, 
    paddingRight:24,
  },

  nodeMetaContainer:{
    paddingTop:12, 
    left:16, 
    paddingBottom:12, 
  },

  whiteBoldFontStyle:{
    fontSize:14, 
    color:'white', 
    fontWeight:'bold',
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

export default NodePage;