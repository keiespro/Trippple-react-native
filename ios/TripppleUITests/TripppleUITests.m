//
//  TripppleUITests.m
//  TripppleUITests
//
//  Created by Alex Lopez on 3/23/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"
#import <RCTTest/RCTTestRunner.h>
#import <RCTTest/FBSnapshotTestCase.h>
#import <RCTTest/RCTSnapshotManager.h>
#import <FBSnapshotTestCase/FBSnapshotTestController.h>

#import "RCTAssert.h"
#import "RCTRedBox.h"
#import "RCTRootView.h"

#define RCT_TEST(name)                  \
- (void)test##name                      \
{                                       \
  [_runner runTest:_cmd module:@#name]; \
}

@interface TripppleUITests : FBSnapshotTestCase
{
  RCTTestRunner *_runner;
}
@end

@implementation TripppleUITests

- (void)setUp {
#if __LP64__
//  RCTAssert(NO, @"Tests should be run on 32-bit device simulators (e.g. iPhone 5)");
#endif
  
  NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;
  RCTAssert((version.majorVersion == 8 && version.minorVersion >= 3) || version.majorVersion >= 9, @"Tests should be run on iOS 8.3+, found %zd.%zd.%zd", version.majorVersion, version.minorVersion, version.patchVersion);

  _runner = RCTInitRunnerForApp(@"test/snapshot/Settings", nil);
  _runner.recordMode = YES;

  [super setUp];
}


- (void)testWelcomes
{
  _runner = RCTInitRunnerForApp(@"test/snapshot/WelcomeTests", nil);

  [_runner
          runTest:_cmd
            module:@"WelcomeTests"
      initialProps:@{@"waitOneFrame": @YES}
   configurationBlock:nil];
}

- (void)testSettings
{
  _runner = RCTInitRunnerForApp(@"test/snapshot/Settings", nil);

  [_runner
   runTest:_cmd
   module:@"SettingsTests"
   initialProps:@{@"waitOneFrame": @YES}
   configurationBlock:nil];
}



- (void)testNotInRecordMode
{

  XCTAssertFalse(_runner.recordMode, @"Don't forget to turn record mode back to off");
}

@end
