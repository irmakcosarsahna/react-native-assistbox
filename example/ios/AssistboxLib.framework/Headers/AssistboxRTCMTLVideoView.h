//
//  AssistboxRTCMTLVideoView.h
//  Assistbox
//
//  Created by Deniz Kibar on 11.10.2021.
//

#import <WebRTC/WebRTC.h>

#ifndef AssistboxRTCMTLVideoView_h
#define AssistboxRTCMTLVideoView_h

#if __LP64__

@interface AssistboxRTCMTLVideoView : RTCMTLVideoView {
	NSInteger participantId;
	BOOL audioStream;
	BOOL videoStream;
}

@end

#else

@interface AssistboxRTCMTLVideoView : NSObject {
	NSInteger participantId;
	BOOL audioStream;
	BOOL videoStream;
}

@end

#endif

#endif /* AssistboxRTCMTLVideoView_h */
