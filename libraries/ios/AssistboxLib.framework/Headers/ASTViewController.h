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

#import <UIKit/UIKit.h>
#import <Foundation/NSJSONSerialization.h>
#import "ASTAvailability.h"
#import "ASTInvokedUrlCommand.h"
#import "ASTCommandDelegate.h"
#import "ASTCommandQueue.h"
#import "ASTScreenOrientationDelegate.h"
#import "ASTPlugin.h"
#import "ASTWebViewEngineProtocol.h"

@interface ASTViewController : UIViewController <ASTScreenOrientationDelegate>{
    @protected
    id <ASTWebViewEngineProtocol> _webViewEngine;
    @protected
    id <ASTCommandDelegate> _commandDelegate;
    @protected
    ASTCommandQueue* _commandQueue;
    NSString* _userAgent;
}
@property (nonatomic, readonly, weak) IBOutlet UIView* webView;
@property (nonatomic, readwrite) UIViewController *presentingViewCont;

@property (nonatomic, readonly, strong) NSMutableDictionary* pluginObjects;
@property (nonatomic, readonly, strong) NSDictionary* pluginsMap;
@property (nonatomic, readonly, strong) NSMutableDictionary* settings;
@property (nonatomic, readonly, strong) NSXMLParser* configParser;

@property (nonatomic, readwrite, copy) NSString* configFile;
@property (nonatomic, readwrite, copy) NSString* wwwFolderName;
@property (nonatomic, readwrite, copy) NSString* startPage;
@property (nonatomic, readonly, strong) ASTCommandQueue* commandQueue;
@property (nonatomic, readonly, strong) id <ASTWebViewEngineProtocol> webViewEngine;
@property (nonatomic, readonly, strong) id <ASTCommandDelegate> commandDelegate;

/**
 The complete user agent that Cordova will use when sending web requests.
 */
@property (nonatomic, readonly) NSString* userAgent;

/**
 The base user agent data that Cordova will use to build its user agent.  If this
 property isn't set, Cordova will use the standard web view user agent as its
 base.
 */
@property (nonatomic, readwrite, copy) NSString* baseUserAgent;

/**
	Takes/Gives an array of UIInterfaceOrientation (int) objects
	ex. UIInterfaceOrientationPortrait
*/
@property (nonatomic, readwrite, strong) NSArray* supportedOrientations;

/**
 The address of the lock token used for controlling access to setting the user-agent
 */
@property (nonatomic, readonly) NSInteger* userAgentLockToken;

- (UIView*)newCordovaViewWithFrame:(CGRect)bounds;

- (NSString*)appURLScheme;
- (NSURL*)errorURL;

- (UIColor*)colorFromColorString:(NSString*)colorString;
- (NSArray*)parseInterfaceOrientations:(NSArray*)orientations;
- (BOOL)supportsOrientation:(UIInterfaceOrientation)orientation;

- (id)getCommandInstance:(NSString*)pluginName;
- (void)registerPlugin:(ASTPlugin*)plugin withClassName:(NSString*)className;
- (void)registerPlugin:(ASTPlugin*)plugin withPluginName:(NSString*)pluginName;

- (void)parseSettingsWithParser:(NSObject <NSXMLParserDelegate>*)delegate;

@end
