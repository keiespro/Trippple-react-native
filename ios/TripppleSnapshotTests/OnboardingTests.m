#import "TripppleSnapshotTest.h"

@interface OnboardingTests : TripppleSnapshotTest

@end

@implementation OnboardingTests : TripppleSnapshotTest

- (void)setUp {
  _runner = RCTInitRunnerForApp(@"test/onboarding", nil);
  _runner.recordMode = getenv("RECORD_MODE");
}

//ONBOARDING

RCT_TEST(Gender)
RCT_TEST(SelectImageSource)
RCT_TEST(Bday)
RCT_TEST(Facebook)
RCT_TEST(Privacy)
RCT_TEST(Name)


@end
