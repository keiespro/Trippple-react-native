#import "ospermissions.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <CoreLocation/CoreLocation.h>
#import <AVFoundation/AVFoundation.h>
#import <AddressBookUI/AddressBookUI.h>

@implementation OSPermissions


RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport {

    ALAuthorizationStatus camerarollPerm = [ALAssetsLibrary authorizationStatus];
    CLAuthorizationStatus locationPerm = [CLLocationManager authorizationStatus];
    AVAuthorizationStatus cameraPerm = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo ];
    ABAuthorizationStatus contactsPerm = ABAddressBookGetAuthorizationStatus();

    BOOL remoteNotificationsEnabled = [UIApplication sharedApplication].isRegisteredForRemoteNotifications;

    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
            [ NSString stringWithString: @(locationPerm).stringValue ], @"location",
            [ NSString stringWithString: @(camerarollPerm).stringValue ], @"cameraRoll",
            [ NSString stringWithString: @(cameraPerm).stringValue], @"camera",
            [ NSString stringWithString: @(contactsPerm).stringValue], @"contacts",
            [ NSString stringWithString: remoteNotificationsEnabled ? @"true" : @"false"], @"notifications",
                                                                                nil];

    return dictionary;
}

RCT_REMAP_METHOD(canUseCamera, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){

    AVAuthorizationStatus cameraPerm = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo ];

    if(cameraPerm){
        resolve(@[@(cameraPerm).stringValue]);
    }else{
        NSError *error = [NSError description];
        reject(@"permission_error", @"????", error);
    }

}

RCT_REMAP_METHOD(canUseNotifications,
                  notifications_resolver:(RCTPromiseResolveBlock)resolve
                  notifications_rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL remoteNotificationsEnabled = [UIApplication sharedApplication].isRegisteredForRemoteNotifications;
    if(remoteNotificationsEnabled){
        resolve(@[@(remoteNotificationsEnabled).stringValue]);
    }else{

        NSError *error = [NSError description];
//                                             code:-42
//                                         userInfo:@{NSUnderlyingErrorKey: error}];
        reject(@"throw", @"Not enabled", error);
    }

}

RCT_REMAP_METHOD(canUseLocation, location_resolver:(RCTPromiseResolveBlock)resolve location_rejecter:(RCTPromiseRejectBlock)reject){
    CLAuthorizationStatus locationPerm = [CLLocationManager authorizationStatus];
    if(locationPerm){
        resolve(@[@(locationPerm).stringValue]);
    }else{
        NSError *error = [NSError description];
        reject(@"no_events", @"There were no events", error);
    }
}

RCT_REMAP_METHOD(canUseCameraRoll,
                 camera_resolver:(RCTPromiseResolveBlock)resolve
                 camera_rejecter:(RCTPromiseRejectBlock)reject){
    ALAuthorizationStatus camerarollPerm = [ALAssetsLibrary authorizationStatus];

    if(camerarollPerm){
        resolve(@[@(camerarollPerm).stringValue]);
    }else{
        NSError *error = [NSError description];
        reject(@"err", @"err", error);
    }
}

RCT_REMAP_METHOD(canUseContacts,
                  contacts_resolver:(RCTPromiseResolveBlock)resolve
                  contacts_rejecter:(RCTPromiseRejectBlock)reject){
    ABAuthorizationStatus contactsPerm = ABAddressBookGetAuthorizationStatus();

    if(contactsPerm){
        resolve(@[@(contactsPerm).stringValue]);
    }else{
        NSError *error = [NSError description];
        reject(@"err", @"err", error);
    }
}

@end
