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
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UIViewController *v = [[Hotline sharedInstance] getConversationsControllerForEmbed];
//    UIViewController *vc =
//    [v.childViewControllers enumerateObjectsUsingBlock:^( UIViewController *obj, NSUInteger idx, BOOL *stop) {
//        NSLog(@"%@",NSStringFromClass(obj.class));
//
//    }];
//    v.removeFromParentViewController;
    
//        [v.childViewControllers enumerateObjectsUsingBlock:^( UIViewController *obj, NSUInteger idx, BOOL *stop) {
//            NSLog(@"%@",NSStringFromClass(obj.class));
//    
//        }];

//    UIView *vi = v.view;
//    NSLog(@"%@",v.class);
//    NSLog(@"%@",vi.class);
////HLCategoriesListController
//    UIViewController *x = vi.inputViewController;
////    x.
//    NSLog(@"%@",x.class);
//    NSLog(@"%@",[v.childViewControllers objectAtIndex: 1].class);
//    NSLog(@"%@",[v.childViewControllers objectAtIndex: 2].class);
//    NSLog(@"%@",[v.childViewControllers objectAtIndex: 3].class);
//    NSLog(@"%@",[v.childViewControllers objectAtIndex: 4].class);

//    NSLog(@"%@",NSStringFromClass(x.class));

//    [UIViewController alloc];
//    vc.removeFromParentViewController;

    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
    [delegate.rootViewController presentViewController:n animated:YES completion:nil];
}

RCT_EXPORT_METHOD(showChat) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UIViewController *v = [[Hotline sharedInstance] getConversationsControllerForEmbed];
    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
//    [n pushViewController:v animated:YES];

    [delegate.rootViewController presentViewController:n animated:YES completion:nil];
}

RCT_EXPORT_METHOD(showFaqs) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UIViewController *v = [[Hotline sharedInstance] getFAQsControllerForEmbed];
        UIView *vi = v.view;
//[    v 
        NSLog(@"%@",v.class);
     NSLog(@"N %@", [v.view.subviews objectAtIndex:1]);
        NSLog(@"%@",vi.class);
    NSLog(@"%@",vi.class);
//    
//            [vi.subviews enumerateObjectsUsingBlock:^( UIView *obj, NSUInteger idx, BOOL *stop) {
//                NSLog(@"%@",NSStringFromClass(obj.class));
//                
//            }];
        NSLog(@"%@",[[vi.subviews objectAtIndex: 0].subviews objectAtIndex:0].class);
    NSLog(@"%@",[[vi.subviews objectAtIndex: 1].subviews objectAtIndex:0].class);

    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
    [delegate.rootViewController presentViewController:n animated:YES completion:nil];
}

RCT_EXPORT_METHOD(showFaqsForMainCategory) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
//    UIViewController *v = [[Hotline sharedInstance] getFAQsControllerForEmbed];
//    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
//    [ presentViewController:n animated:YES completion:nil];
    [[Hotline sharedInstance] showFAQs:delegate.rootViewController];

}

RCT_EXPORT_METHOD(hideView) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}


@end
