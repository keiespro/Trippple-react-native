#import "TripppleChat.h"
//#import "../../Pods/SlackTextViewController/Source/Classes/SLKTextViewController.h"
#import "RCTUIManager.h"
#import "RCTView.h"
#import "UIView+React.h"
#import "SLKTextViewController.h"
#import "./msg/MessageViewController.h"
#import "./msg/MessageView.h"

@implementation TripppleChatManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
  return [[TripppleChat alloc] initWithBridge:_bridge];
}


RCT_EXPORT_VIEW_PROPERTY(matchID, NSNumber);

// 
// RCT_EXPORT_METHOD(sendMessage)
// {
//   // Your implementation here
//     
//     
// }

@end
