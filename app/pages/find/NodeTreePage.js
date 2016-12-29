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
//import NodePage from './NodePage';
import NodeContainer from '../../containers/find/NodeContainer'

class NodeTreePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
    };
  }

  _onBackClick(){
    const { navigator } = this.props;
    navigator.pop();
  }


  _onNodeClick(){
    const { navigator, node } = this;
    console.log('node', node);
    navigator.push({
      component: NodeContainer,
      name : 'nodePage',
      node : node,
    })
  }

  renderItem(node) {
    const { navigator } = this.props;
    return (
      <TouchableOpacity
        onPress={this._onNodeClick}
        navigator={navigator}
        node={node}>
        <View style={styles.cellStyle}>
            <View style={{paddingTop:14}}>
              <Text>{node.name}</Text>
            </View>
            <Image style={{top:14, right:12}} source={require('../../static/imgs/arrow.png')}/>
        </View>
      </TouchableOpacity>
    );
  }


  render() {

    const { categoryNode } = this.props.route;

    let titleConfig = {
      title: categoryNode.category,
    };

    let rows = [];
    if(categoryNode.nodeList){
      rows = categoryNode.nodeList;
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


let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = 'white';

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : backgroundColor,
  },

  navigatorBarStyle:{
    backgroundColor : '#FAFAFA', 
    borderBottomWidth : 1,
    borderBottomColor : borderColor,
  },

  cellStyle:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:cellBorderColor,
    height:44,
    justifyContent: 'space-between',
    marginLeft:16,
  },
});


export default NodeTreePage;

