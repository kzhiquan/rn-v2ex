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

import LoadingView from '../components/LoadingView';
import NodeTopicListContainer from '../containers/NodeTopicListContainer';
import { toastShort } from '../utils/ToastUtil';


class NodeListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
          } )
      };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const { nodeListActions } = this.props;
    nodeListActions.requestNodeList();
  }


  _nodeClick(){
    const { node, navigator } = this;
    //console.log('node:', node);
    navigator.push({
      component: NodeTopicListContainer,
      name : node.name,
      node: node,
    });
  }

  renderItem(categoryNode) {
    const { navigator } = this.props;
    //console.log('categoryNode:',categoryNode)
    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text>{categoryNode.category}</Text>
            </View>

            <View style={styles.itemBody}>
              {
                categoryNode.nodeList.map((node, index) => {
                   return (
                      <TouchableOpacity key={`node-${index}`} onPress={this._nodeClick} node={node} navigator={navigator}>
                        <View style={styles.itemNode}>
                          <Text>{node.name}</Text>
                        </View>
                      </TouchableOpacity>
                   );
                })
              }
            </View>
        </View>
    );

  }


  render() {

    const { nodeList } = this.props;

    let titleConfig = {
      title: '节点'
    };


    let rows = nodeList.categoryNodeList ? nodeList.categoryNodeList : [];

    //console.log('rows', rows);

    return (
      <View style={{flex:1}}>

        <NavigationBar
          title={titleConfig}
        />

        {
          nodeList.isLoading ? 
          <LoadingView /> : 
          <ListView
            initialListSize = {1}
            dataSource={this.state.dataSource.cloneWithRows(rows)}
            renderRow={this.renderItem}
            enableEmptySections = {true}
            removeClippedSubviews = {false}
          />
        }

      </View>
    );
  }

}


const maxWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  itemContainer:{
    flex:1,
    flexDirection:'column',
  },
  itemHeader:{
    backgroundColor:'gray',
    padding:5,
  },
  itemBody:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'flex-start',
  },
  itemNode:{
    borderWidth:1,
    margin:10,
  },
});


export default NodeListPage;

