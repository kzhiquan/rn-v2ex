import React, { PropTypes } from 'react';
import {
  StyleSheet,
  ListView,
  RecyclerViewBackedScrollView,
} from 'react-native';


import NodeContainer from '../containers/find/NodeContainer'
import NodeTableItem from './NodeTableItem';

class NodeListTableView extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
    };
  }

  _onNodeClick(){
    //console.log('this.props', this.props, this);
    const { node, navigator } = this;
    navigator.push({
      component: NodeContainer,
      name : 'nodePage',
      currentNode : node,
    });
  }

  renderItem(node) {
      return (
        <NodeTableItem
          node = {node}
          navigator = {this.props.navigator}
          onClick = {this._onNodeClick}
        />
      )
  }

  render() {
    return (
          <ListView
            initialListSize = {5}
            dataSource={this.state.dataSource.cloneWithRows(this.props.nodeList)}
            renderRow={this.renderItem.bind(this)}
            enableEmptySections={true}
            removeClippedSubviews = {false}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          />
    );
  }
}

NodeListTableView.propTypes = {
  nodeList: React.PropTypes.array,
  navigator : React.PropTypes.object,
};


export default NodeListTableView;



