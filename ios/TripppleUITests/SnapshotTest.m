//
//  SnapshotTest.m
//  Trippple
//
//  Created by Alex Lopez on 3/23/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <RCTTest/RCTTestRunner.h>

#import "RCTAssert.h"
#import "RCTRedBox.h"
#import "RCTRootView.h"

@interface SnapshotTest : XCTestCase
{
  RCTTestRunner *_runner;
}
@end

@implementation SnapshotTest

- (void)setUp {
#if __LP64__
  RCTAssert(NO, @"Tests should be run on 32-bit device simulators (e.g. iPhone 5)");
#endif
  
  NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;
  RCTAssert((version.majorVersion == 8 && version.minorVersion >= 3) || version.majorVersion >= 9, @"Tests should be run on iOS 8.3+, found %zd.%zd.%zd", version.majorVersion, version.minorVersion, version.patchVersion);
  _runner = RCTInitRunnerForApp(@"ios/index.ios", nil);
  _runner.recordMode = YES;
}

#define RCT_TEST(name)                  \
- (void)test##name                      \
{                                       \
[_runner runTest:_cmd module:@#name]; \
}


RCT_TEST(Trippple)

- (void)testZZZNotInRecordMode
{
  XCTAssertFalse(_runner.recordMode, @"Don't forget to turn record mode back to off");
}

@end
