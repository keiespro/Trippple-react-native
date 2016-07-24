#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <RCTTest/RCTTestRunner.h>
#import "RCTAssert.h"
#import "RCTRedBox.h"
#import "RCTRootView.h"

//view.frame = CGRectMake(0, 0, 414, 736);   \


#define RCT_TEST(name)                   \
- (void)test##name                        \
{                                          \
[_runner runTest:_cmd module:@#name         \
initialProps:@{@"data": @[]}               \
configurationBlock:^(RCTRootView *view) {   \
view.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);       \
}];                                           \
}

#define RCT_TEST_W_PROPS(name,mod,props)     \
- (void)test##name                            \
{                                              \
[_runner runTest:_cmd module:@#mod              \
initialProps:@props                            \
configurationBlock:^(RCTRootView *view) {       \
view.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);       \
}];                                               \
}



@interface TripppleSnapshotTest : XCTestCase
{
  RCTTestRunner *_runner;
}
@end
