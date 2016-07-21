#import "TripppleSnapshotTest.h"


@interface CoupleTests : TripppleSnapshotTest
@end

@implementation CoupleTests : TripppleSnapshotTest
- (void)setUp {
  _runner = RCTInitRunnerForApp(@"test/couple", nil);
  _runner.recordMode = getenv("RECORD_MODE");
}

//POTENTIALS
RCT_TEST(Potentials)
RCT_TEST(PotentialsPlaceholder)

//MATCHES & CHAT
RCT_TEST(Matches)
RCT_TEST(Chat)

//SETTINGS
RCT_TEST(Settings)
RCT_TEST(SettingsBasic)
RCT_TEST(SettingsPreferences)
RCT_TEST(SettingsSettings)
RCT_TEST(SettingsCouple)


@end
