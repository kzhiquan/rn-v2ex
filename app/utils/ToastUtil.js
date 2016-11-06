import {
  Platform,
  Alert
} from 'react-native';
import Toast from 'react-native-root-toast';

let toast;

export const toastShort = (content, isAlert) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  if (isAlert) {
    Alert.alert(
      '提示',
      content.toString()
    );
  } else {
    toast = Toast.show(content.toString(), {
      duration: Toast.durations.SHORT,
      position: Platform.OS === 'android' ? Toast.positions.BOTTOM : Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  }
};

export const toastLong = (content, isAlert) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  if (isAlert) {
    Alert.alert(
      '提示',
      content.toString()
    );
  } else {
    toast = Toast.show(content.toString(), {
      duration: Toast.durations.LONG,
      position: Platform.OS === 'android' ? Toast.positions.BOTTOM : Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  }
};