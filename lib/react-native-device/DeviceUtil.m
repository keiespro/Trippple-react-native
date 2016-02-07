#import "DeviceUtil.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"
#import "RCTConvert.h"
#import "sys/utsname.h"

@implementation DeviceUtil

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (instancetype)init
{
  if (self = [super init]) {
//    UIDevice *device = [UIDevice currentDevice];
  }
  
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSDictionary *)constantsToExport {
  UIDevice *device = [UIDevice currentDevice];
  
  return @{
           @"model" : self.deviceName,
           @"name" : (device.name),
           @"systemName" : (device.systemName),
           @"systemVersion" : (device.systemVersion),
           @"localizedModel" : (device.localizedModel),
           @"multitaskingSupported" : ([NSNumber numberWithBool:device.multitaskingSupported]),
           @"userInterfaceIdiom" : self.userInterfaceIdiom,
           @"identifierForVendor" : (device.identifierForVendor.UUIDString),
           };
}

- (NSString *)userInterfaceIdiom {
  switch ([[UIDevice currentDevice] userInterfaceIdiom]) {
    case UIUserInterfaceIdiomPad: return @"Pad"; break;
    case UIUserInterfaceIdiomPhone: return @"Phone"; break;
    default: return @"Unspecified"; break;
  }
}

- (NSString *)deviceName
{
  struct utsname systemInfo;
  uname(&systemInfo);
  
  return [NSString stringWithCString:systemInfo.machine
                            encoding:NSUTF8StringEncoding];
}

@end