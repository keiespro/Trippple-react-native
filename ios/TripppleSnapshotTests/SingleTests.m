#import "TripppleSnapshotTest.h"


@interface SingleTests : TripppleSnapshotTest
@end

@implementation SingleTests : TripppleSnapshotTest
- (void)setUp {
  _runner = RCTInitRunnerForApp(@"test/single", nil);
  _runner.recordMode = getenv("RECORD_MODE");
}
//POTENTIALS
RCT_TEST(Potentials)
RCT_TEST(PotentialsPlaceholder)

//MATCHES & CHAT
RCT_TEST(Matches)
RCT_TEST(Chat)
RCT_TEST_W_PROPS(ChatActionModal,Chat,{@"isVisible": @"true"})


//SETTINGS
RCT_TEST(Settings)
RCT_TEST(SettingsBasic)
RCT_TEST(SettingsPreferences)
RCT_TEST(SettingsSettings)


@end
