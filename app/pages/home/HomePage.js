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


import NavigationBar from 'react-native-navbar';
import Popover from 'react-native-popover';

import SearchContainer from '../../containers/home/SearchContainer';
import TopicListTableView from '../../components/TopicListTableView';
import NewTopicTitlePage from './NewTopicTitlePage';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isVisible:false,
      buttonRect:{},
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  _onClosePopover() {
    this.setState({isVisible: false});
  }

  _onAccountClick(){
    console.log('_onAccountClick');
    this.refs.avatar.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: {x: px, y: py, width: width, height: height}
      });
    });

  }

  _onSearchClick(){
    console.log('_onSearchClick');
    const { navigator } = this.props;
    navigator.push({
      component : SearchContainer,
      name : 'searchPage'
    });
  }

  _onNewTopicClick(){
    console.log('_onNewTopicClick');
    const { navigator } = this.props;
    navigator.push({
      component : NewTopicTitlePage,
      name : 'NewTopicTitlePage',
    });
  }

  render() {
    const { recentActions, recent, auth, navigator } = this.props; 

    let titleConfig = {
      title: "V2EX"
    };

    return (
      <View style={styles.container}>

        <NavigationBar
          style={styles.navigatorBarStyle}
          title={titleConfig}
          statusBar={{tintColor : '#FAFAFA'}}
          leftButton={
            <TouchableOpacity onPress={this._onAccountClick.bind(this)}>
                <Image ref="avatar" style={[styles.avatar_size_32, {left:12, top:6}]} source={{uri:auth.user.avatar_url}}/>
            </TouchableOpacity> 
          }
          rightButton={
            <View style={[styles.directionRow, {right:12}]}>
              <TouchableOpacity onPress={this._onSearchClick.bind(this)}>
                <Image  style={{top:16, right:24}}source={require('../../static/imgs/search.png')}/>
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
        />

        <Popover
          isVisible={this.state.isVisible}
          fromRect={this.state.buttonRect}
          onClose={this._onClosePopover}>
          <Text>I'm the content of this popover!</Text>
        </Popover>

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


});

export default HomePage;