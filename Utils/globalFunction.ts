import {Alert} from 'react-native';
import {Camera} from 'react-native-vision-camera';

export const fetchPermissions = async (callback: (arg0: boolean) => void) => {
  const cameraPermission = await Camera.requestCameraPermission();
  if (cameraPermission === 'granted') {
    callback(true);
  } else {
    Alert.alert('Permission Denied', 'Camera access is required to proceed.');
  }
};
