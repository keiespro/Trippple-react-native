#import "TripppleSnapshotTest.h"



@interface MainTests : TripppleSnapshotTest
@end

@implementation MainTests : TripppleSnapshotTest
- (void)setUp {
  _runner = RCTInitRunnerForApp(@"test/main", nil);
  _runner.recordMode = getenv("RECORD_MODE");
}
//HOME
RCT_TEST(Intro)
RCT_TEST_W_PROPS(Login,Auth,{@"initialTab": @"login"})
RCT_TEST_W_PROPS(Register,Auth,{@"initialTab": @"register"})
RCT_TEST(PinScreen)


//MODALS
RCT_TEST(NewNotificationPermissions)
RCT_TEST_W_PROPS(LocationPermission,LocationPermission,{@"title": @"PRIORITIZE LOCAL?"})
RCT_TEST(PrivacyPermissions)
RCT_TEST(ReportModal)
RCT_TEST(UnmatchModal)
RCT_TEST(CameraPermissions)
RCT_TEST(CameraRollPermissions)


//MISC
RCT_TEST(MaintenanceScreen)
RCT_TEST(ImageFlagged)
RCT_TEST(CheckMark)

@end
