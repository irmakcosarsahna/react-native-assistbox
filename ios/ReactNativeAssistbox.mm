#import "ReactNativeAssistbox.h"

@implementation ReactNativeAssistbox
{
	bool hasListeners;
}
- (instancetype)init {
	return [super init];
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
	return NO;
}


RCT_EXPORT_METHOD(initVideoCallWithToken:(NSString *)token
				  mobileServiceEndpoint:(NSString *)mobileServiceEndpoint
				  splashScreenResourceName:(NSString *)splashScreenResourceName
				  regularNotificationToken: (NSString *)regularNotificationToken
				  successCallback: (RCTResponseSenderBlock)successCallback
				  errorCallback: (RCTResponseSenderBlock)errorCallback {

#if TARGET_IPHONE_SIMULATOR
	errorCallback(@[@"Assistbox SDK does not support iOS Simulators"]);
	return;
#endif

	if (token == nil || [token length] == 0){
		errorCallback(@[@"Token is required"]);
		return;
	}
	if (mobileServiceEndpoint == nil || [mobileServiceEndpoint length] == 0){
		errorCallback(@[@"Mobile Service Endpoint is required"]);
		return;
	}

	dispatch_async(dispatch_get_main_queue(), ^{
		UIViewController* vc = [self getViewController];
		NSLog(@"viewController: %@", vc);
		[[Assistbox shared] initVideoCallWithTokenWithViewController:vc token:token mobileServiceEndpoint:mobileServiceEndpoint splashScreenResourceName:splashScreenResourceName];
		successCallback(@[@"Opening Assistbox SDK"]);
	});
});

RCT_EXPORT_METHOD(initVideoCallWithAccessKey:(NSString *)accessKey
				  mobileServiceEndpoint:(NSString *)mobileServiceEndpoint
				  splashScreenResourceName:(NSString *)splashScreenResourceName
				  regularNotificationToken: (NSString *)regularNotificationToken
				  successCallback: (RCTResponseSenderBlock)successCallback
				  errorCallback: (RCTResponseSenderBlock)errorCallback {

#if TARGET_IPHONE_SIMULATOR
	errorCallback(@[@"Assistbox SDK does not support iOS Simulators"]);
	return;
#endif

	if (accessKey == nil || [accessKey length] == 0){
		errorCallback(@[@"Access Key is required"]);
		return;
	}
	if (mobileServiceEndpoint == nil || [mobileServiceEndpoint length] == 0){
		errorCallback(@[@"Mobile Service Endpoint is required"]);
		return;
	}

	dispatch_async(dispatch_get_main_queue(), ^{
		UIViewController* vc = [self getViewController];
		[[Assistbox shared] initVideoCallWithAccessKeyWithViewController:vc accessKey:accessKey mobileServiceEndpoint:mobileServiceEndpoint splashScreenResourceName:splashScreenResourceName regularNotificationToken:regularNotificationToken redirectToMainApplication:YES];
		successCallback(@[@"Opening Assistbox SDK"]);
	});
});

RCT_EXPORT_METHOD(initC2CModuleAsAgent:(NSString *)mobileServiceEndpoint
				  voipNotificationToken:(NSString *)voipNotificationToken
				  splashScreenResourceName:(NSString *)splashScreenResourceName
				  regularNotificationToken: (NSString *)regularNotificationToken
				  successCallback: (RCTResponseSenderBlock)successCallback
				  errorCallback: (RCTResponseSenderBlock)errorCallback {

#if TARGET_IPHONE_SIMULATOR
	errorCallback(@[@"Assistbox SDK does not support iOS Simulators"]);
	return;
#endif

	if (mobileServiceEndpoint == nil || [mobileServiceEndpoint length] == 0){
		errorCallback(@[@"Mobile Service Endpoint is required"]);
		return;
	}
	if (voipNotificationToken == nil || [voipNotificationToken length] == 0){
		errorCallback(@[@"VoIP Notification Token is required"]);
		return;
	}

	dispatch_async(dispatch_get_main_queue(), ^{
		UIViewController* vc = [self getViewController];
		[Assistbox.shared initC2CModuleAsAgentWithViewController:vc mobileServiceEndpoint:mobileServiceEndpoint voipNotificationToken:voipNotificationToken splashScreenResourceName:splashScreenResourceName regularNotificationToken:regularNotificationToken redirectToMainApplication:YES];
		successCallback(@[@"Opening Assistbox SDK"]);
	});
});

RCT_EXPORT_METHOD(initC2CModuleAsClientWithApiKey:(NSString *)apiKey
				  queueCode:(NSString *)queueCode
				  mobileServiceEndpoint:(NSString *)mobileServiceEndpoint
				  firstName:(NSString *)firstName
				  lastName:(NSString *)lastName
				  email:(NSString *)email
				  phone:(NSString *)phone
				  productName:(NSString *)productName
				  language:(NSString *)language
				  splashScreenResourceName:(NSString *)splashScreenResourceName
				  regularNotificationToken: (NSString *)regularNotificationToken
				  successCallback: (RCTResponseSenderBlock)successCallback
				  errorCallback: (RCTResponseSenderBlock)errorCallback {

#if TARGET_IPHONE_SIMULATOR
	errorCallback(@[@"Assistbox SDK does not support iOS Simulators"]);
	return;
#endif

	if (mobileServiceEndpoint == nil || [mobileServiceEndpoint length] == 0){
		errorCallback(@[@"Mobile Service Endpoint is required"]);
		return;
	}
	if (apiKey == nil || [apiKey length] == 0){
		errorCallback(@[@"Api Key is required"]);
		return;
	}
	if (queueCode == nil || [queueCode length] == 0){
		errorCallback(@[@"Queue Code is required"]);
		return;
	}

	dispatch_async(dispatch_get_main_queue(), ^{
		UIViewController* vc = [self getViewController];
		[Assistbox.shared initC2CModuleAsClientWithApiKeyWithViewController:vc apiKey:apiKey queueCode:queueCode mobileServiceEndpoint:mobileServiceEndpoint firstName:firstName lastName:lastName email:email phone:phone productName:productName language:language splashScreenResourceName:splashScreenResourceName redirectToMainApplication:YES];
		successCallback(@[@"Opening Assistbox SDK"]);
	});
});

RCT_EXPORT_METHOD(initC2CModuleAsClientWithToken:(NSString *)token
				  mobileServiceEndpoint:(NSString *)mobileServiceEndpoint
				  splashScreenResourceName:(NSString *)splashScreenResourceName
				  regularNotificationToken: (NSString *)regularNotificationToken
				  successCallback: (RCTResponseSenderBlock)successCallback
				  errorCallback: (RCTResponseSenderBlock)errorCallback {

#if TARGET_IPHONE_SIMULATOR
	errorCallback(@[@"Assistbox SDK does not support iOS Simulators"]);
	return;
#endif

	if (mobileServiceEndpoint == nil || [mobileServiceEndpoint length] == 0){
		errorCallback(@[@"Mobile Service Endpoint is required"]);
		return;
	}
	if (token == nil || [token length] == 0){
		errorCallback(@[@"Token is required"]);
		return;
	}

	dispatch_async(dispatch_get_main_queue(), ^{
		UIViewController* vc = [self getViewController];
		[Assistbox.shared initC2CModuleAsClientWithTokenWithViewController:vc token:token mobileServiceEndpoint:mobileServiceEndpoint splashScreenResourceName:splashScreenResourceName redirectToMainApplication:YES];
		successCallback(@[@"Opening Assistbox SDK"]);
	});
});

- (UIViewController*) getViewController {
	UIViewController* topMostViewController = [self getTopMostViewController];
	if(topMostViewController.navigationController){
		return topMostViewController;
	} else {
		UIWindow *window = [[UIApplication sharedApplication] keyWindow];
		UIViewController* navController = (UIViewController*)window.rootViewController;
		return navController;
	}
}

- (UIViewController*) getTopMostViewController {
	UIViewController *presentingViewController = [[[UIApplication sharedApplication] delegate] window].rootViewController;
	while (presentingViewController.presentedViewController != nil) {
		presentingViewController = presentingViewController.presentedViewController;
	}
	return presentingViewController;
}

- (NSArray<NSString *> *)supportedEvents {
	return @[@"onAssistboxRedirectPrivate"];
}

-(void)startObserving {
	hasListeners = YES;
}

-(void)stopObserving {
	hasListeners = NO;
}

- (void) sendAssistboxRedirectEvent{
	if(hasListeners){
		[self sendEventWithName:@"onAssistboxRedirectPrivate" body:@{}];
	}
}

- (void)AssistboxViewWillDisappearWithAnimated:(BOOL)animated {
	[self sendAssistboxRedirectEvent];
}

@end
