import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Modal,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import ASIcon from 'react-native-vector-icons/FontAwesome'
import Button from './Button'


class VXMoreModal extends React.Component {
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
              
              <View style={{flexDirection:'row', justifyContent:'space-around', borderWidth:1,}}>

                <TouchableHighlight
                   onPress={this.props.onFavoriteBtnClick}>
                  <View style={{alignItems:'center'}}>
                    <Icon name="ios-star" size={40} />
                    <Text>收藏</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                   onPress={this.props.onThankBtnClick}>
                  <View style={{alignItems:'center'}}>
                    <Icon name="ios-heart" size={40} />
                    <Text>感谢</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                   onPress={this.props.onTweetBtnClick}>
                  <View style={{alignItems:'center'}}>
                    <Icon name="logo-twitter" size={40} />
                    <Text>Tweet</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                   onPress={this.props.onWeiboBtnClick}>
                  <View style={{alignItems:'center'}}>
                    <ASIcon name="weibo" size={40} />
                    <Text>Weibo</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                   onPress={this.props.onSafariBtnClick}>
                  <View style={{alignItems:'center'}}>
                    <Icon name="ios-compass" size={40} />
                    <Text>Safari</Text>
                  </View>
                </TouchableHighlight>

              </View>

              <View style={{borderWidth:1,paddingTop:10,}}>
                <Button
                  style={styles.button}
                  onPress={this.props.onReplyBtnClick}>
                  回复
                </Button>
              </View>

              <View style={{borderWidth:1, paddingTop:10,}}>
                <Button
                  style={styles.button}
                  onPress={this.props.onCancelBtnClick}>
                  取消
                </Button>
              </View>

            </View>

          </View>

        </Modal>
    );
  }

}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'flex-end',
  },
  backgroundStyle : {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    //alignItems: 'center',
    //alignItems:'space-around',
  },
  innerContainerTransparentStyle : {
    backgroundColor: '#fff', 
    padding: 20
  },

  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor:'gray',
  },
});


export default VXMoreModal;