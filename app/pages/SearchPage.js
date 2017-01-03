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
  TextInput,
  Keyboard,
  Dimensions,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import HtmlRender from 'react-native-html-render';

import LoadingView from '../components/LoadingView';
import AccountContainer from '../containers/auth/AccountContainer';
import TopicContainer from '../containers/TopicContainer';
import { toastShort } from '../utils/ToastUtil';
import VXModal from '../components/VXModal';


let canLoadMore;
let page = 1;
let loadMoreTime = 0;

class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,  
      }),
      searchText:'',
      searchTarget:'内容',
    };

    canLoadMore = false;
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }

  componentDidMount() {
    //console.log("componentDidMount");
    this.refs.searchBar.focus();
  }

  _searchTextChange(text){
    //console.log('text', text);
    this.setState({searchText: text});
    //console.log('this.state.searchText', this.state.searchText);
    const { searchActions } = this.props;
    searchActions.startSearch(text);
  }

  _searchSubmit(event){
    //console.log('event text', event.nativeEvent.text);
    const { searchActions } = this.props;
    searchActions.startSearch(this.state.searchText);
  }

  _searchEndEditing(event){
    console.log('_searchEndEditing', event.nativeEvent.text);
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
        )
    }
  }

  _onLinkPress(url){
    console.log('url', url);
  }

  _onTopicClick(){
    const { topic, that } = this;
    const { navigator, searchActions } = that.props;
    //console.log('topClick', that.state.searchText);
    searchActions.addSearchHistory(that.state.searchText);
    navigator.push({
      component : TopicContainer,
      name : 'Topic',
      topic : topic,
    });
  }

  _renderItem(item, sectionID, rowID, highlightRow){
    //console.log(item);
    //<View><Text style={{fontSize:16, fontWeight: 'bold'}}>{item.topic_title.replace('- V2EX', '')}</Text></View>
    return (
      <TouchableOpacity onPress={this._onTopicClick} topic={item} that={this}>
        <View style={styles.itemContainer}>

          <View style={[styles.directionRow, styles.itemInnerWidth]}>
            <HtmlRender
                stylesheet={titleContentStyle}
                key={`${sectionID}-${rowID}-title`}
                value={'<div>' + item.topic_title + '<span>  ' + item.takein_search_date +'</span> </div>'}
                onLinkPress={this._onLinkPress.bind(this)}
                renderNode={this._renderNode}
            />
          </View>

          <View style={[styles.itemInnerWidth, {top:4}]}>
            <HtmlRender
              stylesheet={briefTopicContentStyle}
              key={`${sectionID}-${rowID}-content`}
              value={'<div>' + item.brief_content.replace('<br>', '').replace('\n', '') + '</div>'}
              onLinkPress={this._onLinkPress.bind(this)}
              renderNode={this._renderNode}
            />
          </View>

        </View>
      </TouchableOpacity>

    );
  }

  _renderFooter(){
    
    const { search } = this.props;
    if(search.isLoadingMore){
      return (
        <View style={styles.footerContainer} >
          <ActivityIndicator size="small" color="#3e9ce9" />
          <Text style={styles.footerText}>
            数据加载中……
          </Text>
        </View>
      );
    }

  }

  _onEndReached() {
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
      const { searchActions, search } = this.props;

      console.log('searchResult', search.searchResult)
      if(search.searchResult && search.searchResult.nextPageUrl){
        searchActions.searchNextPage(this.state.searchText, search.searchResult.nextPageUrl);
      }
    }

  }

  _onScroll() {
    console.log('onScroll');
    if (!canLoadMore) {
      canLoadMore = true;
    }

    Keyboard.dismiss();
  }

  _onRefresh(){
    const { searchActions } = this.props;
    searchActions.refreshSearch(this.state.searchText)
  }

  _onRemoveHistoryItemClick(){
    const { item, that } = this;
    const { searchActions } = that.props;
    console.log('removeHistoryItem', item);
    searchActions.removeSearchHistory(item);
  }


  _onHistoryItemClick(){
    const { item, that } = this;
    const { searchActions } = that.props;
    console.log('historyItemPress', item);
    that.setState({searchText:item});
    searchActions.startSearch(item);
  }

  _renderHistroyItem(item, sectionID, rowID, highlightRow){
    return (
      <TouchableOpacity onPress={this._onHistoryItemClick} item={item} that={this}>
        <View style={styles.historyItemContainer}>
          <View style={[styles.directionRow, {left:16, top:12}]}>
            <Image source={require('../static/imgs/time.png')} />
            <View style={{left:16, bottom:2}}>
              <Text style={{fontSize:16, color:'#7A797B'}}>{item}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={this._onRemoveHistoryItemClick} 
            item={item} 
            that={this}
            style={{top:12,right:12,}}>
            <Image source={require('../static/imgs/close.png')} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  _renderSearchBar(){
    return (
      <View style={styles.searchBarContainer}>
        <Image 
          style={{
            top:7,
            left:8,
          }}
          source={require('../static/imgs/search_gray.png')}/>
        <TextInput
          ref="searchBar"
          returnKeyType="search" 
          placeholder="请输入搜索内容"
          style={styles.searchBarStyle}
          onChangeText = { this._searchTextChange.bind(this) }
          value = { this.state.searchText } 
          onSubmitEditing = { this._searchSubmit.bind(this) } />
      </View>

    )
  }

  _onSearchTargetClick(){
    if(this.state.searchTarget == '内容'){
      this.setState({searchTarget:'节点'})
    }else{
      this.setState({searchTarget:'内容'})
    }
  }

  _renderSearchTarget(){

    if(this.state.searchText != ''){
      return null;
    }

    let nodeActiveStyle;
    let contentActiveStyle;
    if(this.state.searchTarget == '内容'){
      contentActiveStyle = {color:'#3B7EFF'};
    }else{
      nodeActiveStyle = {color:'#3B7EFF'};
    }

    return (
        <View style={styles.searchTargetContainer}>

          <TouchableOpacity
            style={styles.searchTargetStyle}
            onPress={this._onSearchTargetClick.bind(this)}>
            <View>
              <Text style={[{fontSize:16}, contentActiveStyle]}>内容</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.searchTargetSeparator}></View>

          <TouchableOpacity
            style={styles.searchTargetStyle}
            onPress={this._onSearchTargetClick.bind(this)}>
            <View>
              <Text style={[{fontSize:16}, nodeActiveStyle]}>节点</Text>
            </View>
          </TouchableOpacity>

        </View>
    )
  }

  _renderSearchResult(){
    const { search } = this.props;

    let rows = [];
    if(search.searchResult){
      rows = search.searchResult.topicList;
    }

    let historyRows = [];
    historyRows = search.history;

    if(this.state.searchText !== ''){
      return (
          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(rows)}          
            renderRow={this._renderItem.bind(this)}
            renderFooter={this._renderFooter.bind(this)}
            onEndReached={this._onEndReached.bind(this)}
            onScroll={this._onScroll.bind(this)}
            onEndReachedThreshold={-20}
            enableEmptySections={true}
            removeClippedSubviews = {false}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            refreshControl={
              <RefreshControl
                refreshing={search.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                title="Loading..."
              />
            }
          />
      )
    }else{
      return (
        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(historyRows)}          
          renderRow={this._renderHistroyItem.bind(this)}
          enableEmptySections={true}
          removeClippedSubviews = {false}
          keyboardShouldPersistTaps = {true}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        />
      )
    }

  }

  render() {

    const { navigator, search, searchActions } = this.props;

    let rightButtonConfig = {
      title: '取消',
      handler: function onBack() {
        searchActions.searchPageClose();
        navigator.pop();
      }
    };

    //console.log('search', search.searchResult);

    return (
      <View>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={this._renderSearchBar()}
          rightButton={rightButtonConfig}
          statusBar={{tintColor : '#FAFAFA'}}
        />

        {this._renderSearchTarget()}

        {this._renderSearchResult()}

        <ActivityIndicator
          animating={ search.isSearching }
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
  searchBarContainer :{
    flex:1,
    flexDirection : 'row',
    height:28,
    left:-18,
    borderRadius:6, 
    backgroundColor:'rgba(3, 3, 3,0.09)'
  },
  searchBarStyle:{
    width:width-12-63-12,
    left:12,
    fontSize:14,
  },
  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

  searchTargetContainer:{
    flexDirection:'row', 
    height:46, 
    borderBottomWidth:1, 
    borderColor:'#B2B2B2'
  },

  searchTargetSeparator:{
    width:1, 
    left:1, 
    height:46, 
    backgroundColor:'#B2B2B2'
  },

  searchTargetStyle:{
    width:(width-3)/2,
    justifyContent:'center',
    alignItems: 'center',
  },

  historyItemContainer:{
    flex:1, 
    flexDirection:'row', 
    borderBottomWidth:1, 
    borderColor:borderColor,
    justifyContent:'space-between',
    height:46,
  },

  itemContainer:{
    flex:1, 
    flexDirection:'column', 
    borderBottomWidth:1,
    borderColor: borderColor,
    
    left:16, 
    paddingTop:12, 
    paddingBottom:8, 
  },

  itemInnerWidth:{
    width:width-16-12,
  },

  metaTextStyle:{
    fontSize:12, 
    color:noteTextColor,
  },




  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  containerItem:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    padding:5,
    justifyContent: 'space-between'
  },
  itemHeader:{
    width:48,
    height:48
  },
  itemBody:{
    width:280
  },
  itemBodyDetail:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  itemFooter:{
    color:'blue',
    paddingTop: 18
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },

  front:{
    position: 'absolute',
    top:300,
    left: (375-50)/2,
    width: 50,
    height:50,
    zIndex: 1,
  },

});

const briefTopicContentStyle = StyleSheet.create({
  strong: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },

  div : {
    fontSize:14,
  }

});

const titleContentStyle = StyleSheet.create({
  strong: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },

  span:{
    fontSize:12, 
    color:noteTextColor,
  },

  div : {
    fontWeight : 'bold',
    fontSize: 16,
  }

});

export default SearchPage;



