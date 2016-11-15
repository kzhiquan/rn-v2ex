import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Modal,
} from 'react-native';


import Button from './Button'


class VXModal extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.props.visible}>
          <View style={[styles.container, styles.backgroundStyle]}>
           <View style={[styles.innerContainer, styles.innerContainerTransparentStyle]}>
              <Text>{this.props.title}</Text>
              <Button
                onPress={this.props.btnClick}
                style={styles.modalButton}>
                {this.props.btnText}
              </Button>
            </View>
          </View>
        </Modal>
    );
  }

}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backgroundStyle : {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  innerContainerTransparentStyle : {
    backgroundColor: '#fff', 
    padding: 20
  },
  modalButton: {
    marginTop: 10,
  },

  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});


export default VXModal;