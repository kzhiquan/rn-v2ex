import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Text,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableWithoutFeedback,
} from 'react-native';


import NavigationBar from 'react-native-navbar';
import NameGotoTableItem from '../../components/NameGotoTableItem';

import SearchContainer from '../../containers/home/SearchContainer';
import TopicListTableView from '../../components/TopicListTableView';
import NewTopicTitlePage from './NewTopicTitlePage';
import AddAccountContainer from '../../containers/auth/AddAccountContainer';


import AccountTableItem from '../../components/AccountTableItem';
import AddAccountTableItem from '../../components/AddAccountTableItem'

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,  
      }),
      isAccoutPopoverVisible:false,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  _onAccountPopoverClick(){
    //console.log('_onAccountPopoverClick');
    let isVisible = !this.state.isAccoutPopoverVisible;
    this.setState({isAccoutPopoverVisible: isVisible});
  }

  _onSearchClick(){
    //console.log('_onSearchClick');
    const { navigator } = this.props;
    navigator.push({
      component : SearchContainer,
      name : 'searchPage'
    });
    this.setState({isAccoutPopoverVisible:false});
  }

  _onNewTopicClick(){
    //console.log('_onNewTopicClick');
    const { navigator } = this.props;
    navigator.push({
      component : NewTopicTitlePage,
      name : 'NewTopicTitlePage',
    });
    this.setState({isAccoutPopoverVisible:false});
  }

  _onAddAccountClick(){

    //console.log("_onAddAccountClick");
    const { navigator } = this.props;
    navigator.push({
      component : AddAccountContainer,
      name : 'AddAcountPage',
    });

    this.setState({isAccoutPopoverVisible:false});
  }

  _onChangeAccountClick(item){

    //console.log("_onChangeAccountClick");
    const { auth, authActions } = this.props;
    if( !auth.user || (auth.user && auth.user.name != item.name)) {
      authActions.changeUser(item);
      this.setState({isAccoutPopoverVisible:false});
    }

  }

  _setPopoverAccountUnvisible(){
    this.setState({isAccoutPopoverVisible:false});
  }

  _renderAccoutItem(item, sectionID, rowID, highlightRow){
    const { auth } = this.props;
    let checkFlag = false;
    if(!this.state.edit && auth.user && auth.user.name == item.name){
      checkFlag = true;
    }
    //console.log('item', item, 'checkFlag', checkFlag);

    if(item.name == '添加账户'){
      return (
          <AddAccountTableItem 
            item={item} 
            onClick={()=>this._onAddAccountClick()}
          /> 
        )
    }else{
      return (
          <AccountTableItem
            item={item}
            checkFlag={checkFlag}
            onClick={()=>this._onChangeAccountClick(item)}
          />
        )
    }
  } 

  _renderAccoutPopover(){

    const { auth } = this.props; 

    let rows = auth.accounts.concat([{
      name: '添加账户',
    }]);

    return (
        <View style={styles.popoverFront}>
          <Image
            style={{left:10}} 
            source={require('../../static/imgs/popover_triangle.png')}
          />
          <View style={styles.popoverAcountList}>
            <ListView
              style={{backgroundColor:'white'}}
              initialListSize = {5}
              dataSource={this.state.dataSource.cloneWithRows(rows)}          
              renderRow={this._renderAccoutItem.bind(this)}
              enableEmptySections={true}
              removeClippedSubviews = {false}
              keyboardShouldPersistTaps = {true}
              renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            />
          </View>

        </View>
    )

  }

  render() {
    const { recentActions, recent, auth, navigator } = this.props; 

    let titleConfig = {
      title: "V2EX"
    };

    return (
      <View 
        style={styles.container}
        onResponderRelease = {this._setPopoverAccountUnvisible.bind(this)}
        onStartShouldSetResponder={()=>true}>
        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          statusBar={{tintColor : '#FAFAFA'}}
          leftButton={
            <TouchableOpacity onPress={this._onAccountPopoverClick.bind(this)}>
                <Image style={[styles.avatar_size_32, {left:12, top:6}]} source={{uri:auth.user.avatar_url}}/>
            </TouchableOpacity> 
          }
          rightButton={
            <View style={[styles.directionRow, {right:12}]}>
              <TouchableOpacity onPress={this._onSearchClick.bind(this)}>
                <Image  style={{top:16, right:24}} source={require('../../static/imgs/search.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onNewTopicClick.bind(this)}>
                <Image  style={{top:11}} source={require('../../static/imgs/write.png')}/>
              </TouchableOpacity>
            </View>

          }
        />

        <TopicListTableView
          navigator = {navigator}
          actions = {{
            load : recentActions.requestRecentTopic,
            refresh : recentActions.refreshRecentTopic,
            loadMore : recentActions.requestMoreRecentTopic,
          }}
          payload = {recent}
          path = '/recent'
          onClick = {()=>this._setPopoverAccountUnvisible()}
        />

        {this.state.isAccoutPopoverVisible && this._renderAccoutPopover()}

        <ActivityIndicator
          animating={ auth.isLoading }
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

  avatar_size_32:{
    width:32,
    height:32,
    borderRadius: 16,
  },

  popoverFront:{
    position: 'absolute',
    flex:1,
    flexDirection:'row',
    top:20,
    left: 36,
    zIndex: 1,
    //backgroundColor:'#EFEFF4',
  },

  popoverAcountList:{
    backgroundColor:'#EFEFF4',
    width:width*0.77, 
    borderRadius:8, 
    paddingTop:22,
    paddingBottom:22,
  },

  front:{
    position: 'absolute',
    top:300,
    left: (width-50)/2,
    width: 50,
    height:50,
    zIndex: 1,
  },


});

export default HomePage;