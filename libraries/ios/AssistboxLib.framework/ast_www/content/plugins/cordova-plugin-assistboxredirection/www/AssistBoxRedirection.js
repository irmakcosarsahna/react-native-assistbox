cordova.define("cordova-plugin-assistboxredirection.AssistBoxRedirection", function(require, exports, module) {
var exec = require('cordova/exec');

exports.goBackToMainApplication = function (success, error, arg) {
    exec(success, error, 'AssistBoxRedirection', 'goBackToMainApplication', [arg]);
};

});
