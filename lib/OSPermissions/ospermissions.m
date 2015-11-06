#import "OSPermissions.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <CoreLocation/CoreLocation.h>
#import <AVFoundation/AVFoundation.h>
#import <AddressBookUI/AddressBookUI.h>

@implementation OSPermissions


RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport {

    ALAuthorizationStatus cameraroll_perm = [ALAssetsLibrary authorizationStatus];
    CLAuthorizationStatus location_perm = [CLLocationManager authorizationStatus];
    AVAuthorizationStatus camera_perm = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo ];
    ABAuthorizationStatus contacts_perm = ABAddressBookGetAuthorizationStatus();
//
//     NSString *location_status;
//
//     if (location_perm==kCLAuthorizationStatusNotDetermined) {
// //        _status.text = @"Not Determined";
//         location_status = @"0";
//     }
//     if (location_perm==kCLAuthorizationStatusDenied) {
// //        _status.text = @"Denied";
//         location_status = @"-1";
//     }
//     if (location_perm==kCLAuthorizationStatusRestricted || location_perm==kCLAuthorizationStatusAuthorizedAlways || location_perm==kCLAuthorizationStatusAuthorizedWhenInUse) {
//     //  @"Restricted" /  @"Always Allowed" / @"When In Use Allowed"
//         location_status = @"1";
//     }



    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
            // [ NSString stringWithString:location_status ], @"location",
            [ NSString stringWithString: @(location_perm).stringValue ], @"location",
            [ NSString stringWithString: @(cameraroll_perm).stringValue ], @"cameraroll",
            [ NSString stringWithString: @(camera_perm).stringValue], @"camera",
            [ NSString stringWithString: @(contacts_perm).stringValue], @"contacts",
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
