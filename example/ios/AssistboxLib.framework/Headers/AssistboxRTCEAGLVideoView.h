//
//  AssistboxRTCEAGLVideoView.h
//  Assistbox
//
//  Created by Deniz Kibar on 7.10.2021.
//

#import <WebRTC/WebRTC.h>

#ifndef AssistboxRTCEAGLVideoView_h
#define AssistboxRTCEAGLVideoView_h
@interface AssistboxRTCEAGLVideoView: RTCEAGLVideoView {
	NSInteger participantId;
	BOOL audioStream;
	BOOL videoStream;
}

@end

#endif /* AssistboxRTCEAGLVideoView_h */
