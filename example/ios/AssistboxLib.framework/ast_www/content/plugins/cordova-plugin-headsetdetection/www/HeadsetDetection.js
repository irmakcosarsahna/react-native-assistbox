cordova.define("cordova-plugin-headsetdetection.ASTHeadsetDetection", function(
  require,
  exports,
  module
) {
  var exec = require("cordova/exec");

  var HeadsetDetection = {
    detect: function(successCallback, errorCallback) {
      exec(successCallback, errorCallback, "ASTHeadsetDetection", "detect", []);
    },
    registerRemoteEvents: function(actionCallback) {
      // Need to call a native function to start recieve events on android
      exec(null, null, "ASTHeadsetDetection", "registerRemoteEvents", []);
      this.actionCallback = actionCallback;
    },
    remoteHeadsetRemoved: function() {
      this.actionCallback && this.actionCallback("headsetRemoved");
    },
    remoteHeadsetAdded: function() {
      this.actionCallback && this.actionCallback("headsetAdded");
    },
    setAudioMode: function(mode) {
      exec(null, null, "ASTHeadsetDetection", "setAudioMode", [mode]);
    }
  };

  module.exports = HeadsetDetection;
});
