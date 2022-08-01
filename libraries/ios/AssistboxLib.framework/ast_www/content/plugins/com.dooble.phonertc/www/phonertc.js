cordova.define("com.dooble.phonertc.PhoneRTC", function (
	require,
	exports,
	module
) {
	var exec = require("cordova/exec");
	var videoViewConfig;

	function createUUID() {
		// http://www.ietf.org/rfc/rfc4122.txt
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}

	function Session(config) {
		// make sure that the config object is valid
		if (typeof config !== "object") {
			throw {
				name: "PhoneRTC Error",
				message: "The first argument must be an object."
			};
		}

		if (
			typeof config.isInitiator === "undefined" ||
			typeof config.turn === "undefined" ||
			typeof config.streams === "undefined"
		) {
			throw {
				name: "PhoneRTC Error",
				message: "isInitiator, turn and streams are required parameters."
			};
		}

		var self = this;
		self.events = {};
		self.config = config;
		self.sessionKey = createUUID();

		// make all config properties accessible from this object
		Object.keys(config).forEach(function (prop) {
			Object.defineProperty(self, prop, {
				get: function () {
					return self.config[prop];
				},
				set: function (value) {
					self.config[prop] = value;
				}
			});
		});

		function callEvent(eventName) {
			if (!self.events[eventName]) {
				return;
			}

			var args = Array.prototype.slice.call(arguments, 1);
			self.events[eventName].forEach(function (callback) {
				callback.apply(self, args);
			});
		}

		function onSendMessage(data) {
			if (data.type === "__answered") {
				callEvent("answer");
			} else if (data.type === "__disconnected") {
				callEvent("disconnect");
			} else if (data.type === "__iceConnected") {
				callEvent("iceConnected");
			} else if (data.type === "__iceDisconnected") {
				callEvent("iceDisconnected");
			} else if (data.type === "__iceFailed") {
				callEvent("iceFailed");
			} else if (data.type === "__peerConnected") {
				callEvent("peerConnected");
			} else if (data.type === "__peerDisconnected") {
				callEvent("peerDisconnected");
			} else if (data.type === "__peerFailed") {
				callEvent("peerFailed");
			} else if (data.type === "__fetchRemoteVideoStreamConstraints") {
				callEvent("fetchRemoteVideoStreamConstraints", data);
			} else if (data.type === "__sessionCreated") {
				callEvent("sessionCreated");
			} else {
				callEvent('sendMessage', data);
			}
		}

		exec(onSendMessage, null, "PhoneRTCPlugin", "createSessionObject", [
			self.sessionKey,
			config
		]);
	}

	Session.prototype.on = function (eventName, fn) {
		// make sure that the second argument is a function
		if (typeof fn !== "function") {
			throw {
				name: "PhoneRTC Error",
				message: "The second argument must be a function."
			};
		}

		// create the event if it doesn't exist
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		} else {
			// make sure that this callback doesn't exist already
			for (var i = 0, len = this.events[eventName].length; i < len; i++) {
				if (this.events[eventName][i] === fn) {
					throw {
						name: "PhoneRTC Error",
						message: "This callback function was already added."
					};
				}
			}
		}

		// add the event
		this.events[eventName].push(fn);
	};

	Session.prototype.off = function (eventName, fn) {
		// make sure that the second argument is a function
		if (typeof fn !== "function") {
			throw {
				name: "PhoneRTC Error",
				message: "The second argument must be a function."
			};
		}

		if (!this.events[eventName]) {
			return;
		}

		var indexesToRemove = [];
		for (var i = 0, len = this.events[eventName].length; i < len; i++) {
			if (this.events[eventName][i] === fn) {
				indexesToRemove.push(i);
			}
		}

		indexesToRemove.forEach(function (index) {
			this.events.splice(index, 1);
		});
	};

	Session.prototype.call = function (success, error, attachMediaFlags) {
		exec(success, error, "PhoneRTCPlugin", "call", [
			{
				sessionKey: this.sessionKey,
				attachLocalMedia: attachMediaFlags.attachLocalMedia,
				attachRemoteMedia: attachMediaFlags.attachRemoteMedia
			}
		]);
	};

	Session.prototype.receiveMessage = function (data) {
		exec(null, null, "PhoneRTCPlugin", "receiveMessage", [
			{
				sessionKey: this.sessionKey,
				message: JSON.stringify(data)
			}
		]);
	};

	Session.prototype.renegotiate = function () {
		exec(null, null, "PhoneRTCPlugin", "renegotiate", [
			{
				sessionKey: this.sessionKey,
				config: this.config
			}
		]);
	};

	Session.prototype.close = function () {
		exec(null, null, "PhoneRTCPlugin", "disconnect", [
			{
				sessionKey: this.sessionKey
			}
		]);
	};

	Session.prototype.sendOffer = function () {
		exec(null, null, "PhoneRTCPlugin", "sendOffer", [
			{
				sessionKey: this.sessionKey
			}
		]);
	};

	exports.Session = Session;

	function getLayoutParams(videoElement) {
		var boundingRect = videoElement.getBoundingClientRect();

		if (cordova.platformId === "android") {
			return {
				position: [
					boundingRect.left + window.scrollX,
					boundingRect.top + window.scrollY
				],
				size: [boundingRect.width, boundingRect.height],
				camera: "Front"
			};
		}

		return {
			position: [boundingRect.left, boundingRect.top],
			size: [boundingRect.width, boundingRect.height],
			camera: "Front"
		};
	}

	function setVideoView(config) {
		videoViewConfig = config;

		var container = config.container;

		if (container) {
			config.containerParams = getLayoutParams(container);
			delete config.container;
		}

		config.devicePixelRatio = window.devicePixelRatio || 2;

		exec(null, null, "PhoneRTCPlugin", "setVideoView", [config]);

		if (container) {
			config.container = container;
		}
	}

	exports.setVideoView = setVideoView;

	// Initializes the audio and video tracks to be shown on the local video renderer.
	// This can be called before a session is created, eg. to show local video view before the meeting starts.
	exports.initializeLocalTracks = function (isAudioEnabled, isVideoEnabled) {
		exec(null, null, "PhoneRTCPlugin", "initializeLocalTracks", [isAudioEnabled, isVideoEnabled]);
	};

	// Disables and hides the local-video view.
	// This can be called before a session is created, eg. while showing the lobby page before the meeting starts.
	exports.hideLocalVideoView = function () {
		exec(null, null, "PhoneRTCPlugin", "hideLocalVideoView", []);
	};

	// Enables and shows the local-video view.
	// This can be called before a session is created, eg. while showing the lobby page before the meeting starts.
	exports.showLocalVideoView = function (viewSize) {
		exec(null, null, "PhoneRTCPlugin", "showLocalVideoView", [viewSize]);
	};

	//This can be called after stop meeting, eg. to remove local view when meeting is not start.
	exports.removeLocalViewAndTracks = function () {
		exec(null, null, "PhoneRTCPlugin", "removeLocalViewAndTracks", []);
	};

	exports.setMeetingLobbyEnabled = function (meetingLobbyEnabled) {
		exec(null, null, "PhoneRTCPlugin", "setMeetingLobbyEnabled", [meetingLobbyEnabled]);
	};

	exports.hideVideoView = function () {
		exec(null, null, "PhoneRTCPlugin", "hideVideoView", []);
	};

	exports.showVideoView = function (showLocalView) {
		exec(null, null, "PhoneRTCPlugin", "showVideoView", [showLocalView]);
	};

	exports.initOrientationChangeListener = function (success) {
		exec(success, null, "PhoneRTCPlugin", "initOrientationChangeListener", [])
	};

	exports.checkVideoCallPermissions = function (success, fail) {
		exec(success, fail, "PhoneRTCPlugin", "checkVideoCallPermissions", []);
	};

	exports.checkStoragePermissions = function (success, fail) {
		exec(success, fail, "PhoneRTCPlugin", "checkStoragePermissions", []);
	};

	exports.changeTrackType = function (param) {
		exec(null, null, "PhoneRTCPlugin", "changeTrackType", [param]);
	};

	exports.setCameraResolutions = function (width, height) {
		exec(null, null, "PhoneRTCPlugin", "setCameraResolutions", [width, height]);
	};

	exports.setVirtualBackgroundStatus = function (param) {
		exec(null, null, "PhoneRTCPlugin", "setVirtualBackgroundStatus", [param]);
	};

	exports.setVirtualBackgroundImageBinary = function (param) {
		exec(null, null, "PhoneRTCPlugin", "setVirtualBackgroundImageBinary", [param]);
	};

	exports.changeCameraDirection = function (success, fail, config) {
		videoViewConfig = config;

		var container = config.container;

		if (container) {
			config.containerParams = getLayoutParams(container);
			delete config.container;
		}

		config.devicePixelRatio = window.devicePixelRatio || 2;
		exec(success, fail, "PhoneRTCPlugin", "changeCameraDirection", [config]);
		if (container) {
			config.container = container;
		}
	};

	exports.stopCapture = function () {
		exec(null, null, "PhoneRTCPlugin", "stopCapture", []);
	};

	exports.startCapture = function (showLocalView) {
		exec(null, null, "PhoneRTCPlugin", "startCapture", [showLocalView]);
	};

	exports.getNetworkStats = function (success) {
		exec(success, null, "PhoneRTCPlugin", "getNetworkStats", [Session.sessionKey]);
	};

	exports.openInAppBrowser = function (param) {
		exec(null, null, "PhoneRTCPlugin", "openInAppBrowser", [param]);
	};

	exports.closeInAppBrowser = function (onSuccess) {
		exec(onSuccess, null, "PhoneRTCPlugin", "closeInAppBrowser", []);
	};

	exports.storeToken = function (token) {
		exec(null, null, "PhoneRTCPlugin", "storeToken", [token]);
	};

	exports.clearToken = function () {
		exec(null, null, "PhoneRTCPlugin", "clearToken", []);
	};

	exports.retrieveToken = function (onSuccess) {
		exec(onSuccess, null, "PhoneRTCPlugin", "retrieveToken", []);
	};

	exports.retrieveIncomingCallQueueId = function (onSuccess) {
		exec(onSuccess, null, "PhoneRTCPlugin", "retrieveIncomingCallQueueId", []);
	};

	exports.clearIncomingCallQueueId = function () {
		exec(null, null, "PhoneRTCPlugin", "clearIncomingCallQueueId", []);
	};

	exports.createDeviceDetail = function (onSuccess, onError, userId, token, oneSignalPushId, fcmToken, serviceEndpoint) {
		exec(onSuccess, onError, "PhoneRTCPlugin", "createDeviceDetail", [userId, token, oneSignalPushId, fcmToken, serviceEndpoint]);
	};

	exports.showTextView = function (mainText, mainTextSize, footerText, footerTextSize, deviceType) {
		exec(null, null, "PhoneRTCPlugin", "showTextView", [mainText, mainTextSize, footerText, footerTextSize, deviceType]);
	};

	exports.hideTextView = function () {
		exec(null, null, "PhoneRTCPlugin", "hideTextView", []);
	};

	exports.startBeepBoop = function () {
		exec(null, null, "PhoneRTCPlugin", "startBeepBoop", []);
	};

	exports.stopBeepBoop = function () {
		exec(null, null, "PhoneRTCPlugin", "stopBeepBoop", []);
	};

	exports.removeViews = function () {
		exec(null, null, "PhoneRTCPlugin", "removeViews", []);
	};

	exports.openSettings = function () {
		exec(null, null, "PhoneRTCPlugin", "openSettings", []);
	};

	exports.setLogParameters = function (token, servicePath, appointmentId, participantId) {
		exec(null, null, "PhoneRTCPlugin", "setLogParameters", [token, servicePath, appointmentId, participantId]);
	};

	exports.setNativeLogLevel = function (logLevel) {
		exec(null, null, "PhoneRTCPlugin", "setNativeLogLevel", [logLevel]);
	};

	exports.setLogAppointmentId = function (appointmentId) {
		exec(null, null, "PhoneRTCPlugin", "setLogAppointmentId", [appointmentId]);
	};

	exports.setLogParticipantId = function (participantId) {
		exec(null, null, "PhoneRTCPlugin", "setLogParticipantId", [participantId]);
	};

	exports.showPolicyPopup = function (onConfirm, parameters, participantId, token, serviceEndpoint) {
		exec(onConfirm, null, "PhoneRTCPlugin", "showPolicyPopup", [parameters, participantId, token, serviceEndpoint]);
	};

	exports.checkLinkAndSendNotification = function (onConfirm, onError, parameters) {
		exec(onConfirm, onError, "PhoneRTCPlugin", "checkLinkAndSendNotification", [parameters]);
	};

	exports.checkPolicyApproval = function (policyWasApproved, policyWasNotApproved, serviceEndpoint, token, legalDetailId) {
		exec(policyWasApproved, policyWasNotApproved, "PhoneRTCPlugin", "checkPolicyApproval", [serviceEndpoint, token, legalDetailId]);
	};

	exports.checkCameraAvailability = function (onSuccess, onError, cameraDirection) {
		exec(onSuccess, onError, "PhoneRTCPlugin", "checkCameraAvailability", [cameraDirection]);
	};

	exports.disposeCamera = function () {
		exec(null, null, "PhoneRTCPlugin", "disposeCamera", []);
	};

	exports.getMobileEndpoint = function (onSuccess) {
		exec(onSuccess, null, "PhoneRTCPlugin", "getMobileEndpoint", []);
	};

	exports.setMobileEndpoint = function (endpoint) {
		exec(null, null, "PhoneRTCPlugin", "setMobileEndpoint", [endpoint]);
	};
	// This can be called after remote stream changed event fired.
	exports.changeRemoteStreamConstraints = function (streamContraints, participantId) {
		exec(null, null, "PhoneRTCPlugin", "changeRemoteStreamConstraints", [streamContraints.audio, streamContraints.video, participantId]);
	};

	exports.stopOngoingCallNotification = function () {
		exec(null, null, "PhoneRTCPlugin", "stopOngoingCallNotification", []);
	};

	exports.startOngoingCallNotification = function (text) {
		exec(null, null, "PhoneRTCPlugin", "startOngoingCallNotification", [text]);
	};

	exports.storeSessionId = function (sessionId) {
		exec(null, null, "PhoneRTCPlugin", "storeSessionId", [sessionId]);
	};

	exports.retrieveCallId = function (onSuccess) {
		exec(onSuccess, null, "PhoneRTCPlugin", "retrieveCallId", []);
	};

	exports.clearCallId = function () {
		exec(null, null, "PhoneRTCPlugin", "clearCallId", []);
	};

	exports.getAssistboxLaunchParameter = function (success, parameter) {
		exec(success, null, "PhoneRTCPlugin", "getAssistboxLaunchParameter", [parameter]);
	};

	exports.forwardToQueue = function (onError, queueCode) {
		exec(null, onError, "PhoneRTCPlugin", "forwardToQueue", [queueCode]);
	};

	exports.setServicePath = function (path) {
		exec(null, null, "PhoneRTCPlugin", "setServicePath", [path]);
	};

	exports.createNotificationDeviceToken = function (token, serviceEndpoint) {
		exec(null, null, "PhoneRTCPlugin", "createNotificationDeviceToken", [token, serviceEndpoint]);
	};

	exports.checkForUpdates = function (callback, token, serviceEndpoint) {
		exec(callback, null, "PhoneRTCPlugin", "checkForUpdates", [token, serviceEndpoint]);
	};

});
