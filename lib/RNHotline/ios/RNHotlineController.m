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

#import  "UIColor+TRColors.h"


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
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
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
    [rootViewController presentViewController:n animated:YES completion:nil];

}


RCT_EXPORT_METHOD(showFaqs) {

    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [[UINavigationBar appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];

    UIViewController *v = [[Hotline sharedInstance] getFAQsControllerForEmbed];
    
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemStop target:self action:@selector(hideView)];
    v.navigationItem.leftBarButtonItem = anotherButton;

    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
    n.navigationBar.backgroundColor = [UIColor tr_shuttleGrayColor];
    n.navigationBar.tintColor = [UIColor tr_whiteColor];

    [rootViewController presentViewController:n animated:YES completion:nil];

}



RCT_EXPORT_METHOD(hideView) {
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
}


@end
