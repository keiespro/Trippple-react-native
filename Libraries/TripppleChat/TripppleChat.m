#import "TripppleChat.h"
//#import "../../Pods/SlackTextViewController/Source/Classes/SLKTextViewController.h"
#import "RCTUIManager.h"
#import "RCTView.h"
#import "UIView+React.h"
#import "SLKTextViewController.h"
#import "./msg/MessageViewController.h"
#import <UIKit/UIKit.h>


@implementation TripppleChat {
  
  MessageViewController *_chatViewController;
  RCTView *_chatBaseView;

}
// AHHAHAH


- (id)initWithBridge:(RCTBridge *)bridge
{
  if ((self = [super init])) {
    _chatViewController = [[MessageViewController alloc] init];
    _chatBaseView = [[RCTView alloc] init];

    /* Must register handler because we are in a new UIWindow and our
     * chatBaseView does not have a RCTRootView parent */
    // _touchHandler = [[RCTTouchHandler alloc] initWithBridge:bridge];
    // [_chatBaseView addGestureRecognizer:_touchHandler];

    _chatViewController.view = _chatBaseView;
  }

  return self;
}


// Taken from react-native/React/Modules/RCTUIManager.m
// Since our view is not registered as a root view we have to manually
// iterate through the chat's subviews and forward the `reactBridgeDidFinishTransaction` message
// If the function below would be a utility function we could just import, it would make
// things less dirty - maybe ask the react-native guys nicely?
typedef void (^react_view_node_block_t)(id<RCTViewNodeProtocol>);

static void RCTTraverseViewNodes(id<RCTViewNodeProtocol> view, react_view_node_block_t block)
{
  if (view.reactTag) block(view);
  for (id<RCTViewNodeProtocol> subview in view.reactSubviews) {
    RCTTraverseViewNodes(subview, block);
  }
}

/* Every component has it is initializer called twice, once to create a base view
 * with default props and another to actually create it and apply the props. We make
 * this prop that is always true in order to not create UIWindow for the default props
 * instance */
- (void)setMatchID:(NSNumber *)matchID {
  // _chatWindow = [[RNClickThroughWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  // _chatWindow.backgroundColor = [UIColor clearColor];
  // _chatWindow.rootViewController = _chatViewController;
  // _chatWindow.userInteractionEnabled = YES;
  // _chatWindow.hidden = NO;

  /* We need to watch for app reload notifications to properly remove the chat,
   * removeFromSuperview does not properly propagate down without this */
  // [[NSNotificationCenter defaultCenter] addObserver:self
  //                                          selector:@selector(removeFromSuperview)
  //                                              name:@"RCTReloadNotification"
  //                                            object:nil];
}

- (void)reactBridgeDidFinishTransaction {
  // forward the `reactBridgeDidFinishTransaction` message to all our subviews
  // in case their native representations do some logic in their handler
  RCTTraverseViewNodes(_chatBaseView, ^(id<RCTViewNodeProtocol> view) {
    if ([view respondsToSelector:@selector(reactBridgeDidFinishTransaction)]) {
      [view reactBridgeDidFinishTransaction];
    }
  });
}

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
  /* Add subviews to the chat base view rather than self */
  [_chatBaseView insertReactSubview:view atIndex:atIndex];
}


- (void)removeFromSuperview
{
  [_chatBaseView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
  _chatViewController = nil;
  _chatBaseView = nil;
  [super removeFromSuperview];
}

@end
