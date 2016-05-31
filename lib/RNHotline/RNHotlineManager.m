//
//  RNHotlineManager.m
//  RNHotline
//
//  Created by Alex Lopez on 5/30/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RNHotlineManager.h"
#import "RNHotline.h"
#import "Hotline.h"

@implementation RNHotlineManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    return [[RNHotline alloc] init];
}

//RCT_EXPORT_VIEW_PROPERTY(blurType, NSString);

@end