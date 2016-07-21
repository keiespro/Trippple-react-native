#import "TripppleSnapshotTest.h"



@implementation TripppleSnapshotTest
- (void)setUp {
    _runner = RCTInitRunnerForApp(@"index.test", nil);
    _runner.recordMode = getenv("RECORD_MODE");
}

@end
