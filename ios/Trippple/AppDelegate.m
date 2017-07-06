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

@import FBSDKCoreKit;
@import Firebase;


#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTJavaScriptLoader.h>
#import <React/RCTLinkingManager.h>
#import "Configuration.h"

#import <React/RCTPushNotificationManager.h>

#import "UIColor+TRColors.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "Hotline.h"
#import "Mixpanel/Mixpanel.h"
#import <UXCam/UXCam.h>

#import <Crashlytics/Answers.h>
#import <Bolts/Bolts.h>
#import "RNFIRMessaging.h"
#import "SplashScreen.h"
#import "ApikeysHeader.h"

@interface AppDelegate() <RCTBridgeDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{


  _bridge = [[RCTBridge alloc] initWithDelegate:self
                                  launchOptions:launchOptions];

  [[UITextField appearance] setKeyboardAppearance:UIKeyboardAppearanceAlert];


  // BEGIN NEWRELIC
//  [NRLogger setLogLevels:NRLogLevelError];
//  [NewRelicAgent disableFeatures:NRFeatureFlag_CrashReporting];
//  [NewRelicAgent startWithApplicationToken:@"AAe71824253eeeff92e1794a97883d2e0c5928816f"];
//   END NEWRELIC

  // BEGIN HOTLINE
  HotlineConfig *config = [[HotlineConfig alloc]
                           initWithAppID:ApiKey
                           andAppKey: AppKey];
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

    [FIRApp configure];
    [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];

  #ifndef DEBUG
    [UXCam startWithKey:@"4cb7699bd5181ca"];
  #endif


  if ([[Hotline sharedInstance]isHotlineNotification:launchOptions]) {
    [[Hotline sharedInstance]handleRemoteNotification:launchOptions
                                          andAppstate:application.applicationState];
  }

   [SplashScreen show];

  [self.window makeKeyAndVisible];



  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
}


- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge
{
  NSURL *sourceURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle" ];
  
  RCTBundleURLProvider *settings = [RCTBundleURLProvider sharedSettings];
  settings.jsLocation = @"localhost";

  #ifdef DEBUG
  NSLog(@"DEBUG");
    return [settings jsBundleURLForBundleRoot:@"index.ios" fallbackResource:[sourceURL absoluteString]];
  #elif Staging
  NSLog(@"Staging");
  return [settings jsBundleURLForBundleRoot:@"index.ios" fallbackResource:[sourceURL absoluteString]];
  #else
    return sourceURL;
  #endif
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

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}

-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFIRMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
#endif






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
                 onProgress:(RCTSourceLoadProgressBlock)onProgress
                 onComplete:(RCTSourceLoadBlock)loadCallback
{
  [RCTJavaScriptLoader loadBundleAtURL:[self sourceURLForBridge:bridge]
                            onProgress:onProgress
                            onComplete:loadCallback];
}




- (void)applicationDidBecomeActive:(UIApplication *)application {
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];

}

@end
