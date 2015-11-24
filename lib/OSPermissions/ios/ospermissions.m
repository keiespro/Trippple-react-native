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

    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
            [ NSString stringWithString: @(locationPerm).stringValue ], @"location",
            [ NSString stringWithString: @(camerarollPerm).stringValue ], @"cameraRoll",
            [ NSString stringWithString: @(cameraPerm).stringValue], @"camera",
            [ NSString stringWithString: @(contactsPerm).stringValue], @"contacts",
                                                                                                                nil];

    return dictionary;
}

RCT_EXPORT_METHOD(canUseCamera:(RCTResponseSenderBlock)callback)
{
    AVAuthorizationStatus cameraPerm = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo ];
    callback(@[@(cameraPerm).stringValue]);
}

RCT_EXPORT_METHOD(canUseLocation:(RCTResponseSenderBlock)callback)
{
    CLAuthorizationStatus locationPerm = [CLLocationManager authorizationStatus];
    callback(@[@(locationPerm).stringValue]);
}

RCT_EXPORT_METHOD(canUseCameraRoll:(RCTResponseSenderBlock)callback)
{
    ALAuthorizationStatus camerarollPerm = [ALAssetsLibrary authorizationStatus];
    callback(@[@(camerarollPerm).stringValue]);
}

RCT_EXPORT_METHOD(canUseContacts:(RCTResponseSenderBlock)callback)
{
    ABAuthorizationStatus contactsPerm = ABAddressBookGetAuthorizationStatus();
    callback(@[@(contactsPerm).stringValue]);
}


//if (status==kCLAuthorizationStatusNotDetermined) {
//    _status.text = @"Not Determined";
//}
//
//if (status==kCLAuthorizationStatusDenied) {
//    _status.text = @"Denied";
//}
//
//if (status==kCLAuthorizationStatusRestricted) {
//    _status.text = @"Restricted";
//}
//
//if (status==kCLAuthorizationStatusAuthorizedAlways) {
//    _status.text = @"Always Allowed";
//}
//
//if (status==kCLAuthorizationStatusAuthorizedWhenInUse) {
//    _status.text = @"When In Use Allowed";
//}


@end
