

# React Native Face Detection Module.
The FaceDetection Module is a React Native library that uses ML Kit's Face Detection technology to identify faces in images. This module processes an image and returns information about detected faces, such as their positions and sizes, directly to your JavaScript code.

Features:
Detect Faces in Images: Works with both remote image URLs and local image files.
Flexible Detection Options: Includes performance modes, landmark detection, and face classification for enhanced capabilities.
Cross-Platform Compatibility: Works seamlessly on both Android and iOS platforms.
Simple Integration: Easy-to-use methods with straightforward inputs and outputs.

Use Cases:
eKYC
Photo KYC Process.
Verify selfies during onboarding processes.
Add facial recognition to photo-based apps.
Implement fun features like face filters or AR overlays.
Perform basic face analysis, such as detecting smiles or eyes.

Input:
Image URI: The module accepts a URI for an image file, which can be a remote URL or a local path (e.g., captured from the camera).
Output:
Detected Faces: An array of objects, where each object contains:
Face bounding box (position and size).
Additional data like landmarks (eyes, nose, mouth) and classification (e.g., smiling or not).

## Note:-
For iOS, You need to capture photo in landscape.

## Step 1: Install npm or yarn


```bash
# using npm
npm install

# OR using Yarn
yarn install
```

### Run the project

```bash
# using npm
npm run ios or npm run android

# OR using Yarn
yarn ios or npm run android
```

### What we have in this Module:-
It will detect how many faces in your picture. It can be use for eKYC feature.

Here Are Some Picture for Explanation:-
## Open Camera:-
![Alt text](https://github.com/SandeepCodeWala/react-native-face-detect/blob/main/camera.jpeg)

## No Face Detected in photo:-
![Alt text](https://github.com/SandeepCodeWala/react-native-face-detect/blob/main/noface.jpeg)

## One Face SuccessFully Detected:-
![Alt text](https://github.com/SandeepCodeWala/react-native-face-detect/blob/main/oneface.jpeg)

## More Than One Face Detected:-
![Alt text](https://github.com/SandeepCodeWala/react-native-face-detect/blob/main/moreface.jpeg)



## Thanks Message:-
![Alt text](https://github.com/SandeepCodeWala/react-native-face-detect/blob/main/thanks.jpeg)