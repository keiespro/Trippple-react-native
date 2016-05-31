//
//  RNHotlineController.m
//  RNHotline
//
//  Created by Alex Lopez on 5/31/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNHotlineController.h"
#import "Hotline.h"

#import "../../ios/trippple/AppDelegate.h"

// NOTE: This application is modifying the autolayout engine from a background thread, which can lead to engine corruption and weird crashes.  This will cause an exception in a future release
// seemingly fixed by dispatching on the main thread

// NOTE: 2016-05-31 00:51:53.858 Trippple[40545:5144097] Warning: Use Hotline controllers inside navigation controller
// ???????

@implementation RNHotlineController


RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}


RCT_EXPORT_METHOD(showConvos) {
//    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
        [delegate.rootViewController presentViewController:[[Hotline sharedInstance] getConversationsControllerForEmbed] animated:YES completion:nil];
//    });
}

RCT_EXPORT_METHOD(showFaqs) {
//    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
        [delegate.rootViewController presentViewController:[[Hotline sharedInstance] getFAQsControllerForEmbed] animated:YES completion:nil];
//    });
}

RCT_EXPORT_METHOD(hideEmbed) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}


@end
