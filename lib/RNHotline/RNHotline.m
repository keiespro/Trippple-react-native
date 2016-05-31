#import "RNHotline.h"
#import "Hotline.h"

@implementation RNHotline {
    UIViewController *_hotlineConvos;
}

- (void)getView
{
    
    _hotlineConvos = [[Hotline sharedInstance] getConversationsControllerForEmbed];
}

-(void)layoutSubviews
{
    [super layoutSubviews];
    
    [self insertSubview:_hotlineConvos atIndex:0];
}

@end
