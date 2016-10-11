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
#import "../../ios/trippple/UIColor+TRColors.h"

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

RCT_EXPORT_METHOD(setUser:(NSString *)user_id name:(NSString *)name phone:(NSString *)phone relStatus:(NSString *)relStatus gender:(NSString *)gender image:(NSString *)image thumb:(NSString *)thumb partner_id:(NSString *)partner_id ){

    HotlineUser *user = [HotlineUser sharedInstance];
    user.name = name;
    user.phoneNumber = phone;
    user.externalID = user_id;
    [[Hotline sharedInstance] updateUserPropertyforKey:@"userType" withValue:relStatus];
    [[Hotline sharedInstance] updateUserPropertyforKey:@"gender" withValue:gender];
    [[Hotline sharedInstance] updateUserPropertyforKey:@"image" withValue:image];
    [[Hotline sharedInstance] updateUserPropertyforKey:@"thumb" withValue:thumb];
    [[Hotline sharedInstance] updateUserPropertyforKey:@"partner_id" withValue:partner_id];
    [[Hotline sharedInstance] updateUser:user];

}

RCT_EXPORT_METHOD(showConvos) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UIViewController *v = [[Hotline sharedInstance] getConversationsControllerForEmbed];
    [[UINavigationBar appearance] setBackgroundColor:[UIColor tr_shuttleGrayColor]];
//    [[UITableViewCell appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];

    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemStop target:self action:@selector(hideView)];
    v.navigationItem.leftBarButtonItem = anotherButton;
    v.view.backgroundColor = [UIColor tr_outerSpaceColor];

    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
    n.navigationBar.backgroundColor = [UIColor tr_shuttleGrayColor];
    n.navigationBar.tintColor = [UIColor tr_whiteColor];
    n.navigationBar.barTintColor = [UIColor tr_shuttleGrayColor];
    v.navigationItem.titleView.tintColor = [UIColor tr_whiteColor];
    [delegate.rootViewController presentViewController:n animated:YES completion:nil];

}


RCT_EXPORT_METHOD(showFaqs) {

    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [[UINavigationBar appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];

    UIViewController *v = [[Hotline sharedInstance] getFAQsControllerForEmbed];
    
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemStop target:self action:@selector(hideView)];
    v.navigationItem.leftBarButtonItem = anotherButton;

    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
    n.navigationBar.backgroundColor = [UIColor tr_shuttleGrayColor];
    n.navigationBar.tintColor = [UIColor tr_whiteColor];

    [delegate.rootViewController presentViewController:n animated:YES completion:nil];

}



RCT_EXPORT_METHOD(hideView) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}


@end
