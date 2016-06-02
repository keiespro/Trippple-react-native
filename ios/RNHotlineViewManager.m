//
//  RNHotlineView.m
//  RNHotline
//
//  Created by Alex Lopez on 5/31/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "../../node_modules/react-native/React/Views/RCTViewManager.h"
@import "RCTViewManager.h"
#import "hotline.h"

@interface RNHotlineViewManager : RCTViewManager
@end

@implementation RNHotlineViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    UIViewController *v = [[Hotline sharedInstance] getFAQsControllerForEmbed];
    UIView *x = v.view;
    
    return x;
}

@end
