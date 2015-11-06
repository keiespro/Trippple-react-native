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
    
    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
            [ NSString stringWithFormat:@"%ld", (long)location_perm   ], @"location",
            [ NSString stringWithFormat:@"%ld", (long)cameraroll_perm ], @"cameraroll",
            [ NSString stringWithFormat:@"%ld", (long)camera_perm     ], @"camera",
            [ NSString stringWithFormat:@"%ld", (long)contacts_perm   ], @"contacts",
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
