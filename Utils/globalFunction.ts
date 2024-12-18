import {Alert} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import FaceDetection, { Face } from '../FaceDetection';

export const fetchPermissions = async (callback: (arg0: boolean) => void) => {
  const cameraPermission = await Camera.requestCameraPermission();
  if (cameraPermission === 'granted') {
    callback(true);
  } else {
    Alert.alert('Permission Denied', 'Camera access is required to proceed.');
  }
};

export  const validateSelfie = async (imagePath: string,callback: (arg0: Face[]) => void) => {
    try {
      const facesDetected = await FaceDetection.detect(imagePath, {
        performanceMode: 'accurate',
        landmarkMode: 'all',
        classificationMode: 'all',
      });
      if (facesDetected.length === 1) {
        callback(facesDetected);
      }
      return facesDetected;
    } catch (error) {
      console.error('Face Detection Error:', error);
      return [];
    }
  };
  
