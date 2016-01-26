/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
#import "RCTPushNotificationManager.h"
#import "AppDelegate.h"
#import "RCTRootView.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "UIColor+TRColors.h"
#import "ReactNativeAutoUpdater.h"

//#ifdef DEBUG
  #define JS_CODE_METADATA_URL @"http://x.local:5000/update.json"
//#else
//  #define JS_CODE_METADATA_URL @"https://blistering-torch-607.firebaseapp.com/update.json"
//#endif

@interface AppDelegate() <ReactNativeAutoUpdaterDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  NSURL *defaultJSCodeLocation;
  
  ReactNativeAutoUpdater* updater = [ReactNativeAutoUpdater sharedInstance];
  [updater setDelegate:self];

  //////// LOAD THE JS //////////

  defaultJSCodeLocation = [NSURL URLWithString:@"http://x.local:8081/index.ios.bundle?platform=ios&dev=true"];   // DEVELOPMENT

  ///////////////////////////

  
//  defaultJSCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"]; // PRODUCTION


  
  NSURL* defaultMetadataFileLocation = [[NSBundle mainBundle] URLForResource:@"metadata" withExtension:@"json"];
  [updater initializeWithUpdateMetadataUrl:[NSURL URLWithString:JS_CODE_METADATA_URL]
                     defaultJSCodeLocation:defaultJSCodeLocation
               defaultMetadataFileLocation:defaultMetadataFileLocation ];
  [updater allowCellularDataUse: YES];
  [updater downloadUpdatesForType: ReactNativeAutoUpdaterPatchUpdate];
  [updater checkUpdate];
  
  NSURL* latestJSCodeLocation = [updater latestJSCodeLocation];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  UIViewController *rootViewController = [UIViewController new];
  
  self.window.rootViewController = rootViewController;
  
  [self createReactRootViewFromURL:latestJSCodeLocation];

  [self.window makeKeyAndVisible];

  return YES;

}

- (void)createReactRootViewFromURL:(NSURL*)url {
  // Make sure this runs on main thread. Apple does not want you to change the UI from background thread.
  dispatch_async(dispatch_get_main_queue(), ^{
    
    RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:url
                                              moduleProvider:nil
                                               launchOptions:nil];
    
    RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:@"trippple"
                                              initialProperties:nil];
    
    rootView.backgroundColor = [UIColor tr_outerSpaceColor];
    
    self.window.rootViewController.view = rootView;
    
  });
}


// RN >= 0.18.0 SYNTAX //
//
// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}


#pragma mark - ReactNativeAutoUpdaterDelegate methods

- (void)ReactNativeAutoUpdater_updateDownloadedToURL:(NSURL *)url {
    NSLog(@"Update succeeded");
    [self createReactRootViewFromURL: url];

}

- (void)ReactNativeAutoUpdater_updateDownloadFailed {
  NSLog(@"Update failed to download");
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

@end
