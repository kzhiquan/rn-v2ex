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

import NodeTreePage from './NodeTreePage';

class AirPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
    };
  }

  _onCategoryNodeClick(){
    const { navigator, categoryNode } = this;
    console.log('categoryNode', categoryNode);
    navigator.push({
      component: NodeTreePage,
      name : 'NodeTreePage',
      categoryNode : categoryNode,
    });
  }

  renderItem(categoryNode) {
    const { navigator } = this.props;
    return (
      <TouchableOpacity
        onPress={this._onCategoryNodeClick}
        navigator={navigator}
        categoryNode={categoryNode}>
        <View style={styles.cellStyle}>
            <View style={{paddingTop:14}}>
              <Text>{categoryNode.category}</Text>
            </View>
            <Image style={{top:14, right:12}} source={require('../../static/imgs/arrow.png')}/>
        </View>
      </TouchableOpacity>
    );
  }


  render() {

    const { nodeList } = this.props;

    let rows = [];
    if(nodeList.categoryNodeList){
      rows = nodeList.categoryNodeList;
    }
    
    return (
      <View>

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


let cellBorderColor = '#EAEAEC';

const styles = StyleSheet.create({
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


export default AirPage;

