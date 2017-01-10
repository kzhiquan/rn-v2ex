import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';



class AccountTableItem extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const { item, checkFlag, itemContainerStyle, itemStyle } = this.props;
    return (
      <TouchableOpacity
        style={[styles.itemContainerStyle, itemContainerStyle]}
        onPress={this.props.onClick}>
        <View style={[styles.itemStyle, itemStyle]}>

          <View style={[styles.directionRow,{flex:1}]}>
            <Image
              style={[styles.avatar_size_42, {top:9,borderRadius:21,}]}
                  source={{uri:item.avatar_url}}
                />
                <View style={[styles.directionRow, {flex: 1, justifyContent:'space-between'}]}>
                  <View style={{paddingTop:22, left:10}}>
                      <Text>{item.name}</Text>
                  </View>
                  {checkFlag && <Image style={{top:22, right:12}} source={require('../static/imgs/checkmark.png')}/>}
                </View>
          </View>

          </View>
      </TouchableOpacity>
    );
  }

}

AccountTableItem.propTypes = {
  onClick: React.PropTypes.func,
  checkFlag : React.PropTypes.bool,
  item : React.PropTypes.shape({
    name : React.PropTypes.string,
    avatar_url : React.PropTypes.string,
  }),
  itemContainerStyle : React.PropTypes.object,
  itemStyle: React.PropTypes.object,
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
  },

  itemContainerStyle:{
    backgroundColor:'white',
  },

  itemStyle:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:cellBorderColor,
    height:60,
    marginLeft:16,
  },

});


export default AccountTableItem;

