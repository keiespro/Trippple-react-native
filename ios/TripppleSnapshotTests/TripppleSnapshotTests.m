

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <RCTTest/RCTTestRunner.h>

#import "RCTAssert.h"
#import "RCTRedBox.h"
#import "RCTRootView.h"


@interface TripppleSnapshotTests : XCTestCase {
  RCTTestRunner *_runner;
}
@end


@implementation TripppleSnapshotTests

- (void)setUp {
  _runner = RCTInitRunnerForApp(@"index.test", nil);
  _runner.recordMode = YES;
  [NSThread sleepForTimeInterval:2.0];

}

#define RCT_TEST(name)                   \
- (void)test##name                        \
{                                          \
  [NSThread sleepForTimeInterval:1.0];      \
[_runner runTest:_cmd module:@#name          \
    initialProps:@{@"data": @[]}              \
    configurationBlock:^(RCTRootView *view) {  \
      view.frame = CGRectMake(0, 0, 414, 736); \
    }];                                          \
}

//HOME

RCT_TEST(Welcome)
RCT_TEST(Login)
RCT_TEST(Register)
RCT_TEST(PinScreen)

//ONBOARDING

RCT_TEST(Gender)
RCT_TEST(SelectImageSource)
RCT_TEST(Bday)
RCT_TEST(Facebook)
RCT_TEST(Privacy)
RCT_TEST(Name)

//POTENTIALS
RCT_TEST(Potentials)
RCT_TEST(PotentialsPlaceholder)

//SETTINGS
RCT_TEST(Settings)
RCT_TEST(SettingsBasic)
RCT_TEST(SettingsPreferences)
RCT_TEST(SettingsSettings)
RCT_TEST(SettingsCouple)


//MISC

RCT_TEST(MaintenanceScreen)
RCT_TEST(ImageFlagged)
RCT_TEST(CheckMark)



//- (void)testSettings {
//  [_runner runTest:_cmd module:@"Settings"];
//}




@end

