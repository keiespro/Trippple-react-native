/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#import "AppDelegate.h"

#import "RCTBridge.h"
#import "RCTJavaScriptLoader.h"
#import "RCTLinkingManager.h"
#import "RCTRootView.h"
#import "RCTPushNotificationManager.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "UIColor+TRColors.h"
#import "ReactNativeAutoUpdater.h"

#define JS_CODE_METADATA_URL @"https://blistering-torch-607.firebaseapp.com/update.json"


@interface AppDelegate() <RCTBridgeDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{


  _bridge = [[RCTBridge alloc] initWithDelegate:self
                                  launchOptions:launchOptions];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:_bridge
                                                   moduleName:@"Trippple"
                                            initialProperties:nil];
  
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge
{
  NSURL *sourceURL;
  NSString *env = @"d";
  NSLog(@"RUNNING IN %@",env);
  
  NSURL* defaultMetadataFileLocation = [[NSBundle mainBundle] URLForResource:@"metadata" withExtension:@"json"];
  NSURL *defaultJSCodeLocation;
  NSString *rootUrl;
  
  ReactNativeAutoUpdater* updater = [ReactNativeAutoUpdater sharedInstance];
  [updater setDelegate:nil];
  [updater initializeWithUpdateMetadataUrl:[NSURL URLWithString:JS_CODE_METADATA_URL]
                     defaultJSCodeLocation:defaultJSCodeLocation
               defaultMetadataFileLocation:defaultMetadataFileLocation ];
  [updater allowCellularDataUse: YES];
  [updater setHostnameForRelativeDownloadURLs:rootUrl];
  [updater downloadUpdatesForType: ReactNativeAutoUpdaterPatchUpdate];
  [updater checkUpdate];
  
  if([env  isEqual: @"production"]){
    //PRODUCTION
    sourceURL = [updater latestJSCodeLocation];
  }else{
    // DEVELOPMENT
    sourceURL = [NSURL URLWithString:@"http://x.local:8081/index.ios.bundle?platform=ios&dev=true"];
  }
  
#if RUNNING_ON_CI
  sourceURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  
  return sourceURL;
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

- (void)loadSourceForBridge:(RCTBridge *)bridge
                  withBlock:(RCTSourceLoadBlock)loadCallback
{
  [RCTJavaScriptLoader loadBundleAtURL:[self sourceURLForBridge:bridge]
                            onComplete:loadCallback];
}

@end
///**
// * Copyright (c) 2015-present, Facebook, Inc.
// * All rights reserved.
// *
// * This source code is licensed under the BSD-style license found in the
// * LICENSE file in the root directory of this source tree. An additional grant
// * of patent rights can be found in the PATENTS file in the same directory.
// */
//#import "RCTPushNotificationManager.h"
//#import "AppDelegate.h"
//#import "RCTRootView.h"
//#import <FBSDKCoreKit/FBSDKCoreKit.h>
//#import "UIColor+TRColors.h"
//#import "ReactNativeAutoUpdater.h"
//
//#define JS_CODE_METADATA_URL @"https://blistering-torch-607.firebaseapp.com/update.json"
//
//@interface AppDelegate() <ReactNativeAutoUpdaterDelegate>
//
//@end
//
//@implementation AppDelegate
//
//- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
//{
//
//  NSString *env = @"d";//[[NSProcessInfo processInfo] environment][@"ENV"];
//  NSLog(@"RUNNING IN %@",env);
//
//  NSURL* defaultMetadataFileLocation = [[NSBundle mainBundle] URLForResource:@"metadata"
//                                                               withExtension:@"json"];
//  NSURL* latestJSCodeLocation;
//  NSURL *defaultJSCodeLocation;
//  NSString *rootUrl;
//
//  if([env isEqual: @"production"]){
//    // PRODUCTION
//    defaultJSCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//    rootUrl = @"https://blistering-torch-607.firebaseapp.com/";
//  }else{
//    // DEVELOPMENT
//    defaultJSCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
//    rootUrl = @"http://localhost/"; // AutoUpdater won't accept a rootUrl with a port
//  }
//
//  ReactNativeAutoUpdater* updater = [ReactNativeAutoUpdater sharedInstance];
//  [updater setDelegate:self];
//  [updater initializeWithUpdateMetadataUrl:[NSURL URLWithString:JS_CODE_METADATA_URL]
//                     defaultJSCodeLocation:defaultJSCodeLocation
//               defaultMetadataFileLocation:defaultMetadataFileLocation ];
//  [updater allowCellularDataUse: YES];
//  [updater setHostnameForRelativeDownloadURLs:rootUrl];
//  [updater downloadUpdatesForType: ReactNativeAutoUpdaterPatchUpdate];
////  [updater checkUpdate];
//
//  if([env  isEqual: @"production"]){
//    //PRODUCTION
//    latestJSCodeLocation = [updater latestJSCodeLocation];
//  }else{
//    // DEVELOPMENT
//    latestJSCodeLocation = defaultJSCodeLocation;
//  }
//
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  UIViewController *rootViewController = [UIViewController new];
//  self.window.rootViewController = rootViewController;
//  RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:latestJSCodeLocation
//                                            moduleProvider:nil
//                                             launchOptions:nil];
//
//  RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                   moduleName:@"Trippple"
//                                            initialProperties:nil];
//
//  rootView.backgroundColor = [UIColor tr_outerSpaceColor];
//  self.window.rootViewController.view = rootView;
//  [self.window makeKeyAndVisible];
//  return YES;
//}
//
//- (void)createReactRootViewFromURL:(NSURL*)url {
//  // Make sure this runs on main thread. Apple does not want you to change the UI from background thread.
//  dispatch_async(dispatch_get_main_queue(), ^{
//
//    RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:url
//                                              moduleProvider:nil
//                                               launchOptions:nil];
//
//    RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                     moduleName:@"Trippple"
//                                              initialProperties:nil];
//    rootView.backgroundColor = [UIColor tr_outerSpaceColor];
//
//    self.window.rootViewController.view = rootView;
//
//  });
//}
//
//// Required to register for notifications
//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
//{
//  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
//}
//// Required for the register event.
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
//  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
//// Required for the notification event.
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
//{
//  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
//}
//
//
//#pragma mark - ReactNativeAutoUpdaterDelegate methods
//
//- (void)ReactNativeAutoUpdater_updateDownloadedToURL:(NSURL *)url {
//    NSLog(@"Update succeeded");
//    [self createReactRootViewFromURL: url];
//
//}
//
//- (void)ReactNativeAutoUpdater_updateDownloadFailed {
//  NSLog(@"Update failed to download");
//}
//
//
//- (void)applicationDidBecomeActive:(UIApplication *)application {
//  [FBSDKAppEvents activateApp];
//}
//
//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
//
//  return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                        openURL:url
//                                              sourceApplication:sourceApplication
//                                                     annotation:annotation];
//}
//
//@end
