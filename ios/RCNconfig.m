//
//  RCNconfig.m
//  Trippple
//
//  Created by davyngoma on 7/6/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCNconfig.h"

@implementation RCNconfig

RCT_EXPORT_MODULE();

//MARK: read info.plist
- (NSDictionary *)constantsToExport
{
  NSString* buildEnvironment = [[[NSBundle mainBundle] infoDictionary] valueForKey:@"BuildEnvironment"];
  return @{@"buildEnvironment": buildEnvironment };
}

@end
