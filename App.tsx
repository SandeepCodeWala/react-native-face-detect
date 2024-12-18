import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {fetchPermissions, validateSelfie} from './Utils/globalFunction';
import {StringText} from './Utils/StringText';

const App = () => {
  let frontCam = useCameraDevice('front');
  let backCam = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [faces, setFaces] = useState([]);
  const [device, setDevice] = useState(frontCam);
  const cameraRef = useRef(null);

  useEffect(() => {
    fetchPermissions(result => setHasPermission(result));
    setDevice(frontCam);
  }, [hasPermission]);

  const captureSelfie = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', StringText.camReady);
      return;
    }
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: device?.position === 'back' ? 'on' : 'off',
      });
      setImageUri(photo.path);
      const faceDetectionResults = await validateSelfie(
        `file://${photo.path}`,
        result => setFaces(result as never[]),
      );
      if (faceDetectionResults.length === 1) {
        Alert.alert('Success', StringText.faceDetected);
      } else if (faceDetectionResults.length > 1) {
        Alert.alert(StringText.moreThanOne, StringText.wantProceed, [
          {
            text: 'Cancel',
            onPress: () => setImageUri(null),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {}},
        ]);
      } else {
        Alert.alert(StringText.noFace, StringText.retry, [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Retry', onPress: () => setImageUri(null)},
        ]);
      }
    } catch (error) {
      console.error('Capture Error:', error);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>{StringText.camAccess}</Text>
      </View>
    );
  }
  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>{StringText.camLoad}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Image
            style={{height: '88%', width: '100%', alignSelf: 'flex-start'}}
            source={{uri: `file://${imageUri}`}}
          />
          <Text onPress={() => setImageUri(null)} style={styles.retake}>
            {StringText.reTake}
          </Text>
          <TouchableOpacity
            style={styles.submitView}
            onPress={() => Alert.alert('', StringText.thanks)}>
            <Image
              style={styles.submitViewIcon}
              source={require('./correct.png')}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Camera
            style={styles.camStyle}
            device={device}
            isActive={true}
            photo={true}
            ref={cameraRef}
          />
          <TouchableOpacity
            onPress={captureSelfie}
            style={styles.captureButtonView}>
            <View style={styles.captureInnerView}></View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              device.position == 'front'
                ? setDevice(backCam)
                : setDevice(frontCam)
            }
            style={styles.captureButton}>
            <Image style={styles.changeCam} source={require('./change.png')} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  retake: {
    position: 'absolute',
    bottom: 30,
    padding: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 5,
    textAlign: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
  },
  submitView: {
    height: 40,
    width: 40,
    right: 10,
    position: 'absolute',
    bottom: 30,
  },
  submitViewIcon: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    tintColor: 'white',
  },
  camStyle: {height: '88%', width: '100%', alignSelf: 'flex-start'},
  captureButtonView: {
    height: 70,
    width: 70,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    justifyContent: 'center',
    bottom: 10,
  },
  captureInnerView: {
    height: 55,
    width: 55,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 50,
  },
  changeCam: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    tintColor: 'white',
  },
});
