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

RCT_EXPORT_METHOD(setUser){

//    Create a user object
    HotlineUser *user = [HotlineUser sharedInstance];

    // To set an identifiable name for the user
    user.name = @"John Doe";

    //To set user's email id
    user.email = @"john.doe.1982@mail.com";

    //To set user's phone number
    user.phoneCountryCode=@"91";
    user.phoneNumber = @"9790987495";

    //To set user's identifier (external id to map the user to a user in your system. Setting an external ID is COMPULSARY for many of Hotline’s APIs
    user.externalID=@"john.doe.82";

    // FINALLY, REMEMBER TO SEND THE USER INFORMATION SET TO HOTLINE SERVERS


    /* Custom properties & Segmentation - You can add any number of custom properties. An example is given below.
     These properties give context for your conversation with the user and also serve as segmentation criteria for your marketing messages */

    //You can set custom user properties for a particular user
    [[Hotline sharedInstance] updateUserPropertyforKey:@"customerType" withValue:@"Premium"];
    //You can set user demographic information
    [[Hotline sharedInstance] updateUserPropertyforKey:@"city" withValue:@"San Bruno"];
    //You can segment based on where the user is in their journey of using your app
    [[Hotline sharedInstance] updateUserPropertyforKey:@"loggedIn" withValue:@"true"];
    //You can capture a state of the user that includes what the user has done in your app
    [[Hotline sharedInstance] updateUserPropertyforKey:@"transactionCount" withValue:@"3"];

    [[Hotline sharedInstance] updateUser:user];

}

RCT_EXPORT_METHOD(showConvos) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UIViewController *v = [[Hotline sharedInstance] getConversationsControllerForEmbed];
//    [[UITableView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UITableViewCell appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];

    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemStop target:self action:@selector(hideView)];
    v.navigationItem.leftBarButtonItem = anotherButton;
    v.view.backgroundColor = [UIColor tr_outerSpaceColor];

    NSLog(@"%@",    v.view.superview);
    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];

    n.navigationBar.backgroundColor = [UIColor tr_shuttleGrayColor];

    for (UIViewController *subviewcontroller in v.childViewControllers)
    {

        for (UITableViewCell *subview in subviewcontroller.view.subviews){
//            [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//            [subview setTintColor:[UIColor tr_outerSpaceColor]];
            NSLog(@"1 %@", subview);

            for (UIView *subviewt in subview.subviews){
                NSLog(@"3 %@", subviewt.class);
                if(subviewt.class == 'FDInputToolbarView'){

//                    [subviewt.UITextView setKeyboardAppearance:UIKeyboardAppearanceAlert];

                }
//                [subviewt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                [subviewt setTintColor:[UIColor tr_outerSpaceColor]];

                    for (UITextView *subviewtt in subviewt.subviews){
//                                    [subviewtt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                                    [subviewtt setTintColor:[UIColor tr_outerSpaceColor]];
                                    NSLog(@"2 %@", subviewtt);
                        if(subviewtt.class == 'UITextView'){
                            subviewtt.keyboardAppearance = UIKeyboardAppearanceAlert;

                                                [subviewtt setKeyboardAppearance:UIKeyboardAppearanceAlert];
                            NSLog(@"2 %@", subviewtt.inputView);


                                }
                    }
            }
        }

    }

    [delegate.rootViewController presentViewController:n animated:YES completion:nil];

}


RCT_EXPORT_METHOD(showFaqs) {
//    [[UIWindow appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UIView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UINavigationBar appearance] setBackgroundColor:[UIColor tr_shuttleGrayColor]];
//    [[UIButton appearance] setBackgroundColor:[UIColor tr_shuttleGrayColor]];
//    [[UIInputView appearance] setBackgroundColor:[UIColor tr_shuttleGrayColor]];
//    [[UIImageView appearance] setBackgroundColor:[UIColor tr_shuttleGrayColor]];
    //    v.view.backgroundColor = [UIColor tr_outerSpaceColor];
    //
    //
    //    for (UIViewController *subviewcontroller in v.childViewControllers)
    //    {
    //
    //        for (UIView *subview in subviewcontroller.childViewControllers)
    //        {
    //            subview.backgroundColor = [UIColor tr_outerSpaceColor];
    //        }
    //
    //    }
    //    for (UIView *subview in v.view.subviews){
    //        subview.backgroundColor = [UIColor tr_outerSpaceColor];
    //
    //    }

    //    n.parentViewController.view.backgroundColor = [UIColor tr_outerSpaceColor];
    //    v.parentViewController.view.backgroundColor = [UIColor tr_outerSpaceColor];
//    UIView *uview;
//    //    uview.backgroundColor = [UIColor tr_outerSpaceColor];
//        uview.backgroundColor = [UIColor tr_outerSpaceColor];


    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
////
//    [[UITableView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UITableView appearance] setTintColor:[UIColor tr_outerSpaceColor]];
//    [[UITableViewCell appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UITableViewCell appearance] setTintColor:[UIColor tr_outerSpaceColor]];
//    [[UITableView appearance] setBackgroundView:uview];
//
////    [[UITextView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UITextView appearance] setTintColor:[UIColor tr_outerSpaceColor]];
//    [[UIScrollView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UIScrollView appearance] setTintColor:[UIColor tr_outerSpaceColor]];
//    [[UICollectionView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UICollectionView appearance] setTintColor:[UIColor tr_outerSpaceColor]];
//    [[UIWebView appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
////    [[UICollectionView appearance] setTintColor:[UIColor tr_outerSpaceColor]];
//    [[UIWindow appearance] setBackgroundColor:[UIColor tr_outerSpaceColor]];
//    [[UIWindow appearance] setTintColor:[UIColor tr_outerSpaceColor]];

    UIViewController *v = [[Hotline sharedInstance] getFAQsControllerForEmbed];
    
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemStop target:self action:@selector(hideView)];
    v.navigationItem.leftBarButtonItem = anotherButton;
//    v.view.backgroundColor = [UIColor tr_outerSpaceColor];
//    v.view.tintColor = [UIColor tr_outerSpaceColor];

    UINavigationController *n = [[UINavigationController alloc] initWithRootViewController:v];
    n.navigationBar.backgroundColor = [UIColor tr_shuttleGrayColor];
    for (UIViewController *subviewcontroller in v.childViewControllers)
    {
        
        for (UIView *subview in subviewcontroller.view.subviews){
            [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
            [subview setTintColor:[UIColor tr_outerSpaceColor]];
            NSLog(@"1 %@", subview);
            
            for (UIView *subviewt in subview.subviews){
                NSLog(@"3 %@", subviewt.class);
                if(subviewt.class == 'FDInputToolbarView'){
                    
                    //                    [subviewt.UITextView setKeyboardAppearance:UIKeyboardAppearanceAlert];
                    
                }
                //                [subviewt setBackgroundColor:[UIColor tr_outerSpaceColor]];
                //                [subviewt setTintColor:[UIColor tr_outerSpaceColor]];
                
                for (UITextView *subviewtt in subviewt.subviews){
                    //                                    [subviewtt setBackgroundColor:[UIColor tr_outerSpaceColor]];
                    //                                    [subviewtt setTintColor:[UIColor tr_outerSpaceColor]];
                    NSLog(@"2 %@", subviewtt);
                    if(subviewtt.class == 'UITextView'){
                        subviewtt.keyboardAppearance = UIKeyboardAppearanceAlert;
                        
                        [subviewtt setKeyboardAppearance:UIKeyboardAppearanceAlert];
                        NSLog(@"2 %@", subviewtt.inputView);
                        
                        
                    }
                }
            }
        }
        
    }

//    for (UIViewController *subviewcontroller in n.viewControllers)
//    {
//
//        for (UIView *subtview in subviewcontroller.view.subviews){
//            [subtview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//            [subtview setTintColor:[UIColor tr_outerSpaceColor]];
//            NSLog(@"z0 %@", subtview.layer);
//
//            for (UIView *subtable in subtview.subviews){
//                [subtable setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                [subtable setTintColor:[UIColor tr_outerSpaceColor]];
//                NSLog(@"z1 %@", subtable.layer);
//
//                for (UIView *subviewt in subtable.subviews){
//                    [subviewt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                    [subviewt setTintColor:[UIColor tr_outerSpaceColor]];
//                    NSLog(@"z2 %@", subviewt);
//
//                    for (UIView *su in subviewt.subviews){
//                        [su setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                        [su setTintColor:[UIColor tr_outerSpaceColor]];
//                        NSLog(@"z3 %@", su);
//                        su.layer.backgroundColor = (__bridge CGColorRef _Nullable)([UIColor tr_outerSpaceColor]);
//
//                        for (UIView *stu in su.subviews){
//                            [stu setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                            [stu setTintColor:[UIColor tr_outerSpaceColor]];
//                            NSLog(@"z4 %@", stu);
//                            for (UIView *stud in stu.subviews){
//                                [stud setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                                [stud setTintColor:[UIColor tr_outerSpaceColor]];
//                                NSLog(@"z5 %@", stud);
//                            }
//                        
//                        }
//                    }
//                }
//                
//            }
//        }
//    }
//                for (UITableView *subview in subtable.subviews){
//                    [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                    [subview setTintColor:[UIColor tr_outerSpaceColor]];
//                    NSLog(@"z1 %@", subview);
//                }
//
//
//
//            }
//
//            for (UIView *subviewt in subview.subviews){
//                NSLog(@"3 %@", subviewt);
////                [subviewt setBackgroundColor:[UIColor tr_outerSpaceColor]];
////                [subviewt setTintColor:[UIColor tr_outerSpaceColor]];
//                NSLog(@"2 %@", subviewt.subviews.lastObject);
//
//                for (UIView *subviewtt in subviewt.subviews){
////                    [subviewtt setBackgroundColor:[UIColor tr_outerSpaceColor]];
////                    [subviewtt setTintColor:[UIColor tr_outerSpaceColor]];
//                    NSLog(@"2 %@", subviewtt);
//
//
//                }
//            }
//        }
//
//        for (UIViewController *subviewcontroller in v.childViewControllers)
//        {
//            for (UITableView *subtable in subviewcontroller.view.subviews){
//                [subtable setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                [subtable setTintColor:[UIColor tr_outerSpaceColor]];
//                NSLog(@"zzt0 %@", subtable);
//                for (UITableViewCell *subview in subtable.subviews){
//                    [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                    [subview setTintColor:[UIColor tr_outerSpaceColor]];
//                    NSLog(@"ttt1 %@", subview);
//                }
//
//
//            }
//            for (UIView *subview in subviewcontroller.view.subviews){
//                //            [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                //            [subview setTintColor:[UIColor tr_outerSpaceColor]];
//                NSLog(@"xx1 %@", subview);
//
//                for (UIView *subtable in subview.subviews){
//                    [subtable setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                    [subtable setTintColor:[UIColor tr_outerSpaceColor]];
//                    NSLog(@"z00000 %@", subtable);
//                    for (UITableViewCell *subview in subtable.subviews){
//                        [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                        [subview setTintColor:[UIColor tr_outerSpaceColor]];
//                        NSLog(@"z0001 %@", subview);
//                    }
//
//
//                }
//
//                for (UIView *subviewt in subview.subviews){
//                    NSLog(@"dd3 %@", subviewt);
//                    [subviewt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                    [subviewt setTintColor:[UIColor tr_outerSpaceColor]];
//
//                    for (UIView *subviewtt in subviewt.subviews){
//                        [subviewtt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                        [subviewtt setTintColor:[UIColor tr_outerSpaceColor]];
//                        NSLog(@"2 %@", subviewtt);
//
//
//                    }
//                }
//            }
//        }

//        for (UITableView *subviewe in subviewcontroller.view.subviews){
//            [subviewe setBackgroundColor:[UIColor tr_outerSpaceColor]];
//            [subviewe setTintColor:[UIColor tr_outerSpaceColor]];
//            NSLog(@"1 %@", subviewe);
//
//
//        for (UITableViewCell *subview in subviewe.subviews){
//            [subview setBackgroundColor:[UIColor tr_outerSpaceColor]];
//            [subview setTintColor:[UIColor tr_outerSpaceColor]];
//            NSLog(@"1 %@", subview);
//
//            for (UIView *subviewt in subview.subviews){
//                NSLog(@"3 %@", subviewt);
//                [subviewt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                [subviewt setTintColor:[UIColor tr_outerSpaceColor]];
//
//                for (UIView *subviewtt in subviewt.subviews){
//                    [subviewtt setBackgroundColor:[UIColor tr_outerSpaceColor]];
//                    [subviewtt setTintColor:[UIColor tr_outerSpaceColor]];
//                    NSLog(@"2 %@", subviewtt);
//
//
//                }
//            }
//        }
//        }

//    }


    [delegate.rootViewController presentViewController:n animated:YES completion:nil];

}



RCT_EXPORT_METHOD(hideView) {
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}


@end
