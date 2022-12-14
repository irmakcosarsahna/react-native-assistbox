cordova.define('cordova/plugin_list', function (require, exports, module) {
	module.exports = [
		{
			"id": "cordova-plugin-device.device",
			"file": "plugins/cordova-plugin-device/www/device.js",
			"pluginId": "cordova-plugin-device",
			"clobbers": [
				"device"
			]
		},
		{
			"id": "cordova-plugin-camera.Camera",
			"file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
			"pluginId": "cordova-plugin-camera",
			"clobbers": [
				"Camera"
			]
		},
		{
			"id": "cordova-plugin-camera.CameraPopoverOptions",
			"file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
			"pluginId": "cordova-plugin-camera",
			"clobbers": [
				"CameraPopoverOptions"
			]
		},
		{
			"id": "cordova-plugin-camera.camera",
			"file": "plugins/cordova-plugin-camera/www/Camera.js",
			"pluginId": "cordova-plugin-camera",
			"clobbers": [
				"navigator.camera"
			]
		},
		{
			"id": "cordova-plugin-camera.CameraPopoverHandle",
			"file": "plugins/cordova-plugin-camera/www/ios/CameraPopoverHandle.js",
			"pluginId": "cordova-plugin-camera",
			"clobbers": [
				"CameraPopoverHandle"
			]
		},
		{
			"id": "cordova-plugin-chrome-apps-power.power",
			"file": "plugins/cordova-plugin-chrome-apps-power/power.js",
			"pluginId": "cordova-plugin-chrome-apps-power",
			"clobbers": [
				"chrome.power"
			]
		},
		{
			"id": "cordova-plugin-file-opener2.FileOpener2",
			"file": "plugins/cordova-plugin-file-opener2/www/plugins.FileOpener2.js",
			"pluginId": "cordova-plugin-file-opener2",
			"clobbers": [
				"cordova.plugins.fileOpener2"
			]
		},
		{
			"id": "cordova-plugin-flashlight.Flashlight",
			"file": "plugins/cordova-plugin-flashlight/www/Flashlight.js",
			"pluginId": "cordova-plugin-flashlight",
			"clobbers": [
				"window.plugins.flashlight"
			]
		},
		{
			"id": "cordova-plugin-assistboxredirection.AssistBoxRedirection",
			"file": "plugins/cordova-plugin-assistboxredirection/www/AssistBoxRedirection.js",
			"pluginId": "cordova-plugin-assistboxredirection",
			"clobbers": [
				"window.AssistBoxRedirection"
			]
		},
		{
			"id": "cordova-plugin-geolocation.Coordinates",
			"file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
			"pluginId": "cordova-plugin-geolocation",
			"clobbers": [
				"Coordinates"
			]
		},
		{
			"id": "cordova-plugin-geolocation.PositionError",
			"file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
			"pluginId": "cordova-plugin-geolocation",
			"clobbers": [
				"PositionError"
			]
		},
		{
			"id": "cordova-plugin-geolocation.Position",
			"file": "plugins/cordova-plugin-geolocation/www/Position.js",
			"pluginId": "cordova-plugin-geolocation",
			"clobbers": [
				"Position"
			]
		},
		{
			"id": "cordova-plugin-geolocation.geolocation",
			"file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
			"pluginId": "cordova-plugin-geolocation",
			"clobbers": [
				"navigator.geolocation"
			]
		},
		{
			"id": "cordova-plugin-headsetdetection.ASTHeadsetDetection",
			"file": "plugins/cordova-plugin-headsetdetection/www/HeadsetDetection.js",
			"pluginId": "cordova-plugin-headsetdetection",
			"clobbers": [
				"window.HeadsetDetection"
			]
		},
		{
			"id": "cordova-plugin-media.MediaError",
			"file": "plugins/cordova-plugin-media/www/MediaError.js",
			"pluginId": "cordova-plugin-media",
			"clobbers": [
				"window.MediaError"
			]
		},
		{
			"id": "cordova-plugin-media.Media",
			"file": "plugins/cordova-plugin-media/www/Media.js",
			"pluginId": "cordova-plugin-media",
			"clobbers": [
				"window.Media"
			]
		},
		{
			"id": "cordova-plugin-network-information.network",
			"file": "plugins/cordova-plugin-network-information/www/network.js",
			"pluginId": "cordova-plugin-network-information",
			"clobbers": [
				"navigator.connection",
				"navigator.network.connection"
			]
		},
		{
			"id": "cordova-plugin-network-information.Connection",
			"file": "plugins/cordova-plugin-network-information/www/Connection.js",
			"pluginId": "cordova-plugin-network-information",
			"clobbers": [
				"Connection"
			]
		},
		{
			"id": "cordova-plugin-splashscreen.SplashScreen",
			"file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
			"pluginId": "cordova-plugin-splashscreen",
			"clobbers": [
				"navigator.splashscreen"
			]
		},
		{
			"id": "cordova-plugin-x-toast.Toast",
			"file": "plugins/cordova-plugin-x-toast/www/Toast.js",
			"pluginId": "cordova-plugin-x-toast",
			"clobbers": [
				"window.plugins.toast"
			]
		},
		{
			"id": "cordova-plugin-x-toast.tests",
			"file": "plugins/cordova-plugin-x-toast/test/tests.js",
			"pluginId": "cordova-plugin-x-toast"
		},
		{
			"id": "ionic-plugin-keyboard.keyboard",
			"file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
			"pluginId": "ionic-plugin-keyboard",
			"clobbers": [
				"cordova.plugins.Keyboard"
			],
			"runs": true
		},
		{
			"id": "com.dooble.phonertc.PhoneRTC",
			"file": "plugins/com.dooble.phonertc/www/phonertc.js",
			"pluginId": "com.dooble.phonertc",
			"clobbers": [
				"cordova.plugins.phonertc"
			]
		},
		{
			"id": "cordova-plugin-screen-orientation.screenorientation",
			"file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
			"pluginId": "cordova-plugin-screen-orientation",
			"clobbers": [
				"cordova.plugins.screenorientation"
			]
		},
		{
			"id": "cordova-plugin-dialogs.notification",
			"file": "plugins/cordova-plugin-dialogs/www/notification.js",
			"pluginId": "cordova-plugin-dialogs",
			"clobbers": [
				"navigator.notification"
			]
		},
		{
			"id": "cordova-plugin-documentpicker.DocumentPicker",
			"file": "plugins/cordova-plugin-documentpicker/www/DocumentPicker.js",
			"pluginId": "cordova-plugin-documentpicker",
			"clobbers": [
				"DocumentPicker"
			]
		},
		{
			"id": "cordova-plugin-actionsheet.ActionSheet",
			"file": "plugins/cordova-plugin-actionsheet/www/ActionSheet.js",
			"pluginId": "cordova-plugin-actionsheet",
			"clobbers": [
				"window.plugins.actionsheet"
			]
		},
		{
			"id": "cordova-plugin-mfilechooser.MFileChooser",
			"file": "plugins/cordova-plugin-mfilechooser/www/mfilechooser.js",
			"pluginId": "cordova-plugin-mfilechooser",
			"clobbers": [
				"MFileChooser"
			]
		},
		{
			"id": "cordova-plugin-console.console",
			"file": "plugins/cordova-plugin-console/www/console-via-logger.js",
			"pluginId": "cordova-plugin-console",
			"clobbers": [
				"console"
			]
		},
		{
			"id": "cordova-plugin-console.logger",
			"file": "plugins/cordova-plugin-console/www/logger.js",
			"pluginId": "cordova-plugin-console",
			"clobbers": [
				"cordova.logger"
			]
		},
		{
			"id": "cordova-plugin-file.DirectoryEntry",
			"file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.DirectoryEntry"
			]
		},
		{
			"id": "cordova-plugin-file.DirectoryReader",
			"file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.DirectoryReader"
			]
		},
		{
			"id": "cordova-plugin-file.Entry",
			"file": "plugins/cordova-plugin-file/www/Entry.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.Entry"
			]
		},
		{
			"id": "cordova-plugin-file.File",
			"file": "plugins/cordova-plugin-file/www/File.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.File"
			]
		},
		{
			"id": "cordova-plugin-file.FileEntry",
			"file": "plugins/cordova-plugin-file/www/FileEntry.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileEntry"
			]
		},
		{
			"id": "cordova-plugin-file.FileError",
			"file": "plugins/cordova-plugin-file/www/FileError.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileError"
			]
		},
		{
			"id": "cordova-plugin-file.FileReader",
			"file": "plugins/cordova-plugin-file/www/FileReader.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileReader"
			]
		},
		{
			"id": "cordova-plugin-file.FileSystem",
			"file": "plugins/cordova-plugin-file/www/FileSystem.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileSystem"
			]
		},
		{
			"id": "cordova-plugin-file.FileUploadOptions",
			"file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileUploadOptions"
			]
		},
		{
			"id": "cordova-plugin-file.FileUploadResult",
			"file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileUploadResult"
			]
		},
		{
			"id": "cordova-plugin-file.FileWriter",
			"file": "plugins/cordova-plugin-file/www/FileWriter.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.FileWriter"
			]
		},
		{
			"id": "cordova-plugin-file.Flags",
			"file": "plugins/cordova-plugin-file/www/Flags.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.Flags"
			]
		},
		{
			"id": "cordova-plugin-file.LocalFileSystem",
			"file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.LocalFileSystem"
			],
			"merges": [
				"window"
			]
		},
		{
			"id": "cordova-plugin-file.Metadata",
			"file": "plugins/cordova-plugin-file/www/Metadata.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.Metadata"
			]
		},
		{
			"id": "cordova-plugin-file.ProgressEvent",
			"file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.ProgressEvent"
			]
		},
		{
			"id": "cordova-plugin-file.fileSystems",
			"file": "plugins/cordova-plugin-file/www/fileSystems.js",
			"pluginId": "cordova-plugin-file"
		},
		{
			"id": "cordova-plugin-file.requestFileSystem",
			"file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
			"pluginId": "cordova-plugin-file",
			"clobbers": [
				"window.requestFileSystem"
			]
		},
		{
			"id": "cordova-plugin-file.resolveLocalFileSystemURI",
			"file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
			"pluginId": "cordova-plugin-file",
			"merges": [
				"window"
			]
		},
		{
			"id": "cordova-plugin-file.isChrome",
			"file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
			"pluginId": "cordova-plugin-file",
			"runs": true
		},
		{
			"id": "cordova-plugin-file.iosFileSystem",
			"file": "plugins/cordova-plugin-file/www/ios/FileSystem.js",
			"pluginId": "cordova-plugin-file",
			"merges": [
				"FileSystem"
			]
		},
		{
			"id": "cordova-plugin-file.fileSystems-roots",
			"file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
			"pluginId": "cordova-plugin-file",
			"runs": true
		},
		{
			"id": "cordova-plugin-file.fileSystemPaths",
			"file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
			"pluginId": "cordova-plugin-file",
			"merges": [
				"cordova"
			],
			"runs": true
		},
		{
			"id": "cordova-plugin-media-capture.CaptureAudioOptions",
			"file": "plugins/cordova-plugin-media-capture/www/CaptureAudioOptions.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"CaptureAudioOptions"
			]
		},
		{
			"id": "cordova-plugin-media-capture.CaptureImageOptions",
			"file": "plugins/cordova-plugin-media-capture/www/CaptureImageOptions.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"CaptureImageOptions"
			]
		},
		{
			"id": "cordova-plugin-media-capture.CaptureVideoOptions",
			"file": "plugins/cordova-plugin-media-capture/www/CaptureVideoOptions.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"CaptureVideoOptions"
			]
		},
		{
			"id": "cordova-plugin-media-capture.CaptureError",
			"file": "plugins/cordova-plugin-media-capture/www/CaptureError.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"CaptureError"
			]
		},
		{
			"id": "cordova-plugin-media-capture.MediaFileData",
			"file": "plugins/cordova-plugin-media-capture/www/MediaFileData.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"MediaFileData"
			]
		},
		{
			"id": "cordova-plugin-media-capture.MediaFile",
			"file": "plugins/cordova-plugin-media-capture/www/MediaFile.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"MediaFile"
			]
		},
		{
			"id": "cordova-plugin-media-capture.helpers",
			"file": "plugins/cordova-plugin-media-capture/www/helpers.js",
			"pluginId": "cordova-plugin-media-capture",
			"runs": true
		},
		{
			"id": "cordova-plugin-media-capture.capture",
			"file": "plugins/cordova-plugin-media-capture/www/capture.js",
			"pluginId": "cordova-plugin-media-capture",
			"clobbers": [
				"navigator.device.capture"
			]
		},
		{
			"id": "cordova-plugin-statusbar.statusbar",
			"file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
			"pluginId": "cordova-plugin-statusbar",
			"clobbers": [
				"window.StatusBar"
			]
		},
		{
			"id": "cordova-plugin-ionic-webview.IonicWebView",
			"file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
			"pluginId": "cordova-plugin-ionic-webview",
			"clobbers": [
				"Ionic.WebView"
			]
		},
		{
			"id": "cordova-plugin-ionic-webview.ios-wkwebview-exec",
			"file": "plugins/cordova-plugin-ionic-webview/src/www/ios/ios-wkwebview-exec.js",
			"pluginId": "cordova-plugin-ionic-webview",
			"clobbers": [
				"cordova.exec"
			]
		}
	];
	module.exports.metadata =
	// TOP OF METADATA
	{
		"cordova-plugin-device": "1.1.4",
		"cordova-plugin-camera": "2.4.1",
		"cordova-plugin-chrome-apps-power": "1.0.4",
		"cordova-plugin-file-opener2": "2.0.19",
		"cordova-plugin-flashlight": "3.2.0",
		"cordova-plugin-assistboxredirection": "1.0.0",
		"cordova-plugin-geolocation": "4.0.1",
		"cordova-plugin-headsetdetection": "3.0.0",
		"cordova-plugin-media": "3.0.1",
		"cordova-plugin-network-information": "1.3.3",
		"cordova-plugin-splashscreen": "4.0.3",
		"cordova-plugin-whitelist": "1.3.1",
		"cordova-plugin-x-toast": "2.6.0",
		"ionic-plugin-keyboard": "2.2.1",
		"com.dooble.phonertc": "2.1.0",
		"cordova-plugin-compat": "1.2.0",
		"cordova-plugin-screen-orientation": "3.0.1",
		"cordova-plugin-dialogs": "2.0.1",
		"cordova-plugin-locationservices": "2.1.0",
		"cordova-plugin-add-swift-support": "1.6.1",
		"cordova-plugin-documentpicker": "0.0.1",
		"cordova-plugin-actionsheet": "2.3.3",
		"cordova-plugin-mfilechooser": "1.0.5",
		"cordova-plugin-console": "1.1.0",
		"cordova-plugin-file": "6.0.1",
		"cordova-plugin-media-capture": "3.0.2",
		"cordova-plugin-statusbar": "2.4.2",
		"cordova-plugin-ionic-webview": "2.5.2"
	};
	// BOTTOM OF METADATA
});
