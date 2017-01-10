import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';



class NameTableItem extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const { name, payload, navigator } = this.props;
    return (
      <TouchableOpacity
        onPress={this.props.onClick}>
        <View style={styles.cellStyle}>
            <View style={{paddingTop:14}}>
              <Text>{name}</Text>
            </View>
            <Image style={{top:14, right:12}} source={require('../static/imgs/arrow.png')}/>
        </View>
      </TouchableOpacity>
    );
  }
}

NameTableItem.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
};

const {height, width} = Dimensions.get('window');
let cellBorderColor = '#EAEAEC';

var styles = StyleSheet.create({

  cellStyle:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:cellBorderColor,
    height:44,
    justifyContent: 'space-between',
    marginLeft:16,
  }

});


export default NameTableItem;