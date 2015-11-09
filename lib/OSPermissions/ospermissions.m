#import "OSPermissions.h"
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
//
//     NSString *location_status;
//
//     if (locationPerm==kCLAuthorizationStatusNotDetermined) {
// //        _status.text = @"Not Determined";
//         location_status = @"0";
//     }
//     if (locationPerm==kCLAuthorizationStatusDenied) {
// //        _status.text = @"Denied";
//         location_status = @"-1";
//     }
//     if (locationPerm==kCLAuthorizationStatusRestricted || locationPerm==kCLAuthorizationStatusAuthorizedAlways || locationPerm==kCLAuthorizationStatusAuthorizedWhenInUse) {
//     //  @"Restricted" /  @"Always Allowed" / @"When In Use Allowed"
//         location_status = @"1";
//     }



    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
            [ NSString stringWithString: @(locationPerm).stringValue ], @"location",
            [ NSString stringWithString: @(camerarollPerm).stringValue ], @"cameraRoll",
            [ NSString stringWithString: @(cameraPerm).stringValue], @"camera",
            [ NSString stringWithString: @(contactsPerm).stringValue], @"contacts",
                                                                                                                nil];

    return dictionary;
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
