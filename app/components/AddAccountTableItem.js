import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';



class AddAccountTableItem extends React.Component {
  
  constructor(props){
    super(props);
  }

  render() {
    const { item, itemContainerStyle, itemStyle } = this.props;
    return (
      <TouchableOpacity
        style={[styles.itemContainerStyle, this.props.itemContainerStyle]}
        onPress={this.props.onClick}
        >
        <View style={[styles.itemStyle, this.props.itemStyle]}>
          <Image 
            style={{top:17,left:9}} 
            source={require('../static/imgs/plus.png')}/>

              <View style={{paddingTop:22, left:22}}>
                <Text>{item.name}</Text>
              </View>

          </View>
      </TouchableOpacity>
    );
  }

}

AddAccountTableItem.propTypes = {
  onClick: React.PropTypes.func,
  item : React.PropTypes.shape({
    name : React.PropTypes.string,
  }),
  itemContainerStyle : React.PropTypes.object,
  itemStyle: React.PropTypes.object,
};

const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let backgroundColor = 'white';

var styles = StyleSheet.create({

  itemContainerStyle:{
    backgroundColor:'white',
  },

  itemStyle:{
    flex:1,
    flexDirection:'row',
    height:60,
    marginLeft:16,
  },

});


export default AddAccountTableItem;

