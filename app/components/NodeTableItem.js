import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';



class NodeTableItem extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const { navigator, node } = this.props;

    return (
      <TouchableOpacity onPress={this.props.onClick} node={node} navigator={navigator}>
        <View style={styles.nodeItemContainer}>
          <Image 
            style={styles.avatar_size_42} 
            source={{uri:node.avatar_url}} />
          <View style={[styles.avatarRightContent, {flexDirection:'row', justifyContent:'space-between', paddingTop:12}]}>
            <View>
              <Text style={{fontSize:16}}>{node.name}</Text>
            </View>
            <View style={styles.directionRow}>
              <Image 
                style={{left:8}}
                source={require('../static/imgs/arrow.png')}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

NodeTableItem.propTypes = {
  onClick: React.PropTypes.func,
  node: React.PropTypes.object,
  navigator : React.PropTypes.object,
};

const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let backgroundColor = 'white';

var styles = StyleSheet.create({

  directionRow:{
    flexDirection : 'row',
  },

  avatar_size_42:{
    width:42,
    height:42,
    borderRadius:21,
  },

  avatarRightContent:{
    left:10,
    width : width-12-10-16-42-10,
  },

  nodeItemContainer : {
    flexDirection : 'row',
    flex : 1, 
    paddingTop:8, 
    left:16, 
    paddingBottom:10, 
    height:60,
    borderBottomWidth : 1, 
    borderBottomColor : borderColor,
  },

});


export default NodeTableItem;