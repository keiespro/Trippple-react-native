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
#import "RCTBundleURLProvider.h"

#import "RCTLinkingManager.h"
#import "RCTRootView.h"
#import "RCTPushNotificationManager.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "UIColor+TRColors.h"
#import <ReactNativeAutoUpdater/ReactNativeAutoUpdater.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "Hotline.h"
#import <Crashlytics/Answers.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Bolts/Bolts.h>
//@import Firebase;

@interface AppDelegate() <RCTBridgeDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  _bridge = [[RCTBridge alloc] initWithDelegate:self
                                  launchOptions:launchOptions];

  [[UITextField appearance] setKeyboardAppearance:UIKeyboardAppearanceAlert];


  // BEGIN NEWRELIC
  [NRLogger setLogLevels:NRLogLevelError];
  [NewRelicAgent disableFeatures:NRFeatureFlag_CrashReporting];
  [NewRelicAgent startWithApplicationToken:@"AAe71824253eeeff92e1794a97883d2e0c5928816f"];
//   END NEWRELIC

  // BEGIN HOTLINE
  HotlineConfig *config = [[HotlineConfig alloc]
                           initWithAppID:@"f54bba2a-84fa-43c8-afa9-098f3c1aefae"
                           andAppKey:@"fba1b915-fa8b-4c24-bdda-8bac99fcf92a"];
  config.displayFAQsAsGrid = NO;
  config.voiceMessagingEnabled = NO;
  config.pictureMessagingEnabled = YES;
  config.cameraCaptureEnabled = NO;
  config.agentAvatarEnabled = YES;
  config.showNotificationBanner = YES;
  config.themeName = @"T3Theme";
  config.notificationSoundEnabled = YES;

  [[Hotline sharedInstance] initWithConfig:config];
  // END HOTLINE

  // BEGIN FABRIC
  [Fabric with:@[[Crashlytics class],[Answers class]]];
  // END FABRIC


  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:_bridge
                                                      moduleName:@"Trippple"
                                               initialProperties:nil];

  rootView.backgroundColor = [UIColor tr_outerSpaceColor];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  self.rootViewController = rootViewController;

  [self.window makeKeyAndVisible];


//  [FIRApp configure];


    // NEEDED?

  if ([[Hotline sharedInstance]isHotlineNotification:launchOptions]) {
    [[Hotline sharedInstance]handleRemoteNotification:launchOptions
                                          andAppstate:application.applicationState];
  }
  

  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
}


- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge
{

  NSURL *sourceURL;
  NSLog(@"%s",getenv("RELEASE"));
//xs  if(getenv("RELEASE")){
    sourceURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  }else{
//    [[RCTBundleURLProvider sharedSettings] setEnableDev:YES];
//    [[RCTBundleURLProvider sharedSettings] setJsLocation:@"localhost"];
//    sourceURL = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:@"main"];
//  }
  return sourceURL;
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
  // Required to register for notifications
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  [[Hotline sharedInstance] updateDeviceToken:deviceToken];
  // Required for the register event.
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  if ([[Hotline sharedInstance]isHotlineNotification:notification]) {
    [[Hotline sharedInstance]handleRemoteNotification:notification andAppstate:application.applicationState];
  }
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
  // Required for the notification event.
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
  // Required for the localNotification event.
}



- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  if([url.scheme isEqualToString:@"trippple"]){

    BFURL *parsedUrl = [BFURL URLWithInboundURL:url sourceApplication:sourceApplication];
    if ([parsedUrl appLinkData]) {
      // this is an applink url, handle it here
      NSURL *targetUrl = [parsedUrl targetURL];
      AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];

      return [RCTLinkingManager application:application openURL:targetUrl
                          sourceApplication:sourceApplication annotation:annotation];

    }else{

      AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];

      return [RCTLinkingManager application:application openURL:url
                          sourceApplication:sourceApplication annotation:annotation];

    }

  }

  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                               annotation:annotation];

}


//- (void)tokenRefreshNotification:(NSNotification *)notification {
//  // Note that this callback will be fired everytime a new token is generated, including the first
//  // time. So if you need to retrieve the token as soon as it is available this is where that
//  // should be done.
//  NSString *refreshedToken = [[FIRInstanceID instanceID] token];
//  NSLog(@"InstanceID token: %@", refreshedToken);
//
//  // Connect to FCM since connection may have failed when attempted before having a token.
//  [self connectToFcm];
//
//  // TODO: If necessary send token to application server.
//}



- (void)loadSourceForBridge:(RCTBridge *)bridge
                  withBlock:(RCTSourceLoadBlock)loadCallback
{
  [RCTJavaScriptLoader loadBundleAtURL:[self sourceURLForBridge:bridge]
                            onComplete:loadCallback];
}




- (void)applicationDidBecomeActive:(UIApplication *)application {
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  [FBSDKAppEvents activateApp];
}

@end

