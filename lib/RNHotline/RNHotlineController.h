//
//  RNHotlineController.h
//  RNHotline
//
//  Created by Alex Lopez on 5/31/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "../../node_modules/react-native/React/Base/RCTBridgeModule.h"
#import <UIKit/UIKit.h>


@interface RNHotlineController : NSObject<RCTBridgeModule>

@property (nonatomic, retain) UIViewController *embed;
@end
