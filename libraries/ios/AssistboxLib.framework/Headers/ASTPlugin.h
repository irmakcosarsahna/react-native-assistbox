/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "ASTPluginResult.h"
#import "NSMutableArray+QueueAdditions.h"
#import "ASTCommandDelegate.h"
#import "ASTWebViewEngineProtocol.h"

@interface UIView (org_apache_cordova_UIView_Extension)

@property (nonatomic, weak) UIScrollView* scrollView;

@end

extern NSString* const ASTPageDidLoadNotification;
extern NSString* const ASTPluginHandleOpenURLNotification;
extern NSString* const ASTPluginResetNotification;
extern NSString* const ASTViewWillAppearNotification;
extern NSString* const ASTViewDidAppearNotification;
extern NSString* const ASTViewWillDisappearNotification;
extern NSString* const ASTViewDidDisappearNotification;
extern NSString* const ASTViewWillLayoutSubviewsNotification;
extern NSString* const ASTViewDidLayoutSubviewsNotification;
extern NSString* const ASTViewWillTransitionToSizeNotification;

/*
 * The local and remote push notification functionality has been removed from the core in cordova-ios 4.x,
 * but these constants have unfortunately have not been removed, but will be removed in 5.x.
 * 
 * To have the same functionality as 3.x, use a third-party plugin or the experimental
 * https://github.com/apache/cordova-plugins/tree/master/notification-rebroadcast
 */
extern NSString* const ASTLocalNotification AST_DEPRECATED(4.0, "Functionality removed in 4.0, constant will be removed in 5.0");
extern NSString* const ASTRemoteNotification AST_DEPRECATED(4.0, "Functionality removed in 4.0, constant will be removed in 5.0");
extern NSString* const ASTRemoteNotificationError AST_DEPRECATED(4.0, "Functionality removed in 4.0, constant will be removed in 5.0");

@interface ASTPlugin : NSObject {}

@property (nonatomic, readonly, weak) UIView* webView;
@property (nonatomic, readonly, weak) id <ASTWebViewEngineProtocol> webViewEngine;

@property (nonatomic, weak) UIViewController* viewController;
@property (nonatomic, weak) id <ASTCommandDelegate> commandDelegate;

@property (readonly, assign) BOOL hasPendingOperation;

- (void)pluginInitialize;

- (void)handleOpenURL:(NSNotification*)notification;
- (void)onAppTerminate;
- (void)onMemoryWarning;
- (void)onReset;
- (void)dispose;

/*
 // see initWithWebView implementation
 - (void) onPause {}
 - (void) onResume {}
 - (void) onOrientationWillChange {}
 - (void) onOrientationDidChange {}
 */

- (id)appDelegate;

@end
