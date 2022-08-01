import { DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-assistbox' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Assistbox = NativeModules.ReactNativeAssistbox  ? NativeModules.ReactNativeAssistbox  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );


let iosRedirectListener: any;

const sendRedirectEventToMainApplication = ()  => {
  console.debug("Emitting onAssistboxRedirect event");
  DeviceEventEmitter.emit("onAssistboxRedirect");
  if (iosRedirectListener) {
    iosRedirectListener.remove();
  }
}

const registerOnAssistboxRedirectListener = ()  => {
  if (Platform.OS.toLowerCase() === 'ios') {
    const eventEmitter = new NativeEventEmitter(Assistbox);
    eventEmitter.removeAllListeners("onAssistboxRedirectPrivate");
    iosRedirectListener = eventEmitter.addListener('onAssistboxRedirectPrivate', sendRedirectEventToMainApplication);
  } else if (Platform.OS.toLowerCase() === "android") {
    DeviceEventEmitter.removeAllListeners("onAssistboxRedirectPrivate");
    DeviceEventEmitter.addListener('onAssistboxRedirectPrivate', sendRedirectEventToMainApplication);
  }
}


const initVideoCallWithToken = (opts, successCallback, errorCallback) =>  {
  registerOnAssistboxRedirectListener();
  if (Platform.OS.toLowerCase() === 'ios') {
    Assistbox.initVideoCallWithToken(
      opts.token,
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  } else if (Platform.OS.toLowerCase() === "android") {
    Assistbox.initVideoCallWithToken(
      opts.token,
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.notificationIconResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  }
}

const initVideoCallWithAccessKey = (opts, successCallback, errorCallback) => {
  registerOnAssistboxRedirectListener();
  if (Platform.OS.toLowerCase() === 'ios') {
    Assistbox.initVideoCallWithAccessKey(
      opts.accessKey,
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  } else if (Platform.OS.toLowerCase() === "android") {
    Assistbox.initVideoCallWithAccessKey(
      opts.accessKey,
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.notificationIconResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  }
}

const initC2CModuleAsAgent = (opts, successCallback, errorCallback) => {
  registerOnAssistboxRedirectListener();
  if (Platform.OS.toLowerCase() === 'ios') {
    Assistbox.initC2CModuleAsAgent(
      opts.mobileServiceEndpoint,
      opts.voipNotificationToken,
      opts.splashScreenResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  } else if (Platform.OS.toLowerCase() === "android") {
    Assistbox.initC2CModuleAsAgent(
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.notificationIconResourceName,
      opts.regularNotificationToken,
      opts.oneSignalPushId,
      successCallback,
      errorCallback
    );
  }
}

const initC2CModuleAsClientWithApiKey = (opts, successCallback, errorCallback) => {
  registerOnAssistboxRedirectListener();
  if (Platform.OS.toLowerCase() === 'ios') {
    Assistbox.initC2CModuleAsClientWithApiKey(
      opts.apiKey,
      opts.queueCode,
      opts.mobileServiceEndpoint,
      opts.firstName,
      opts.lastName,
      opts.email,
      opts.phone,
      opts.productName,
      opts.language,
      opts.splashScreenResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  } else if (Platform.OS.toLowerCase() === "android") {
    Assistbox.initC2CModuleAsClientWithApiKey(
      opts.apiKey,
      opts.queueCode,
      opts.mobileServiceEndpoint,
      opts.firstName,
      opts.lastName,
      opts.email,
      opts.phone,
      opts.productName,
      opts.language,
      opts.showContactForm,
      opts.splashScreenResourceName,
      opts.notificationIconResourceName,
      successCallback,
      errorCallback
    );
  }
}

const initC2CModuleAsClientWithToken = (opts, successCallback, errorCallback) => {
  registerOnAssistboxRedirectListener();
  if (Platform.OS.toLowerCase() === 'ios') {
    Assistbox.initC2CModuleAsClientWithToken(
      opts.token,
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.regularNotificationToken,
      successCallback,
      errorCallback
    );
  } else if (Platform.OS.toLowerCase() === "android") {
    Assistbox.initC2CModuleAsClientWithToken(
      opts.token,
      opts.mobileServiceEndpoint,
      opts.splashScreenResourceName,
      opts.notificationIconResourceName,
      successCallback,
      errorCallback
    );
  }
}

export {
  initVideoCallWithToken,
  initVideoCallWithAccessKey,
  initC2CModuleAsAgent,
  initC2CModuleAsClientWithApiKey,
  initC2CModuleAsClientWithToken,
};

