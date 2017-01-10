import React from 'react';
import {
  Image,
} from 'react-native';
import NameTableItem from './NameTableItem';


class NameGotoTableItem extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
        <NameTableItem 
          name = {this.props.name}
          onClick = {this.props.onClick}>
          <Image style={{top:14, right:12}} source={require('../static/imgs/arrow.png')}/>
        </NameTableItem>
      );
  }
}

NameGotoTableItem.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
};



export default NameGotoTableItem;