#import "FaceDetection.h"

@import MLKitVision.MLKVisionImage;
@import MLKitFaceDetection;

@implementation FaceDetection

RCT_EXPORT_MODULE()

// Normalize image orientation
- (UIImage *)normalizeImage:(UIImage *)image {
    if (image.imageOrientation == UIImageOrientationUp) {
        return image;
    }
    
    UIGraphicsBeginImageContextWithOptions(image.size, NO, image.scale);
    [image drawInRect:CGRectMake(0, 0, image.size.width, image.size.height)];
    UIImage *normalizedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return normalizedImage;
}

// Configure face detection options
- (MLKFaceDetectorOptions *)getOptions:(NSDictionary *)dict {
    MLKFaceDetectorOptions *options = [[MLKFaceDetectorOptions alloc] init];
    options.performanceMode = [dict[@"performanceMode"] isEqualToString:@"accurate"] ? MLKFaceDetectorPerformanceModeAccurate : MLKFaceDetectorPerformanceModeFast;
    options.landmarkMode = [dict[@"landmarkMode"] isEqualToString:@"all"] ? MLKFaceDetectorLandmarkModeAll : MLKFaceDetectorLandmarkModeNone;
    options.classificationMode = [dict[@"classificationMode"] isEqualToString:@"all"] ? MLKFaceDetectorClassificationModeAll : MLKFaceDetectorClassificationModeNone;
    return options;
}

// Exported method for face detection
RCT_EXPORT_METHOD(detect:(nonnull NSString *)url
                  withOptions:(NSDictionary *)optionsDict
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSData *imageData;

    // Handle file and remote URLs
    if ([url hasPrefix:@"file://"]) {
        NSString *filePath = [url stringByReplacingOccurrencesOfString:@"file://" withString:@""];
        imageData = [NSData dataWithContentsOfFile:filePath];
    } else if ([url hasPrefix:@"http://"] || [url hasPrefix:@"https://"]) {
        NSURL *_url = [NSURL URLWithString:url];
        imageData = [NSData dataWithContentsOfURL:_url];
    } else {
        reject(@"Invalid URL", @"The provided image URI is not valid.", nil);
        return;
    }

    if (!imageData) {
        reject(@"Image Error", @"Failed to load image data.", nil);
        return;
    }

    UIImage *image = [UIImage imageWithData:imageData];
    if (!image) {
        reject(@"Image Error", @"Failed to create image from data.", nil);
        return;
    }

    // Normalize the image orientation
    UIImage *normalizedImage = [self normalizeImage:image];

    // Prepare the MLKit VisionImage
    MLKVisionImage *visionImage = [[MLKVisionImage alloc] initWithImage:normalizedImage];
    visionImage.orientation = UIImageOrientationUp;

    // Create face detector with options
    MLKFaceDetectorOptions *options = [self getOptions:optionsDict];
    MLKFaceDetector *faceDetector = [MLKFaceDetector faceDetectorWithOptions:options];

    [faceDetector processImage:visionImage
                    completion:^(NSArray<MLKFace *> *faces, NSError *error) {
        if (error) {
            reject(@"Face Detection Error", @"Failed to detect faces", error);
            return;
        }

        NSMutableArray *result = [NSMutableArray array];
        for (MLKFace *face in faces) {
            NSDictionary *faceDict = @{
                @"frame": @{
                    @"x": @(face.frame.origin.x),
                    @"y": @(face.frame.origin.y),
                    @"width": @(face.frame.size.width),
                    @"height": @(face.frame.size.height)
                },
                @"hasSmilingProbability": @(face.hasSmilingProbability),
                @"smilingProbability": @(face.smilingProbability)
            };
            [result addObject:faceDict];
        }

        resolve(result);
    }];
}

@end
