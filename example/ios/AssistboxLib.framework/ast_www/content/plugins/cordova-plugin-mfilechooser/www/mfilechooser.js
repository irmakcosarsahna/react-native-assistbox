cordova.define("cordova-plugin-mfilechooser.MFileChooser", function(require, exports, module) {
/**
 * cordova Maginsoft FileChooser plugin
 */
 (function(cordova){
    var MFileChooser = function() {

    };

    MFileChooser.prototype.open = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args.uri, args.extension);
        }, function(args) {
            fail(args);
        }, 'MFileChooser', 'open', params);
    };

    window.mfilechooser = new MFileChooser();
    
    // backwards compatibility
    window.plugins = window.plugins || {};
    window.plugins.mfilechooser = window.mfilechooser;
})(window.PhoneGap || window.Cordova || window.cordova);
});
