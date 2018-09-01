let callbackList = {};

module.exports = {
    on: function(type, callback){
        var specCallbackList = callbackList[type] = callbackList[type] || [];
        !~specCallbackList.indexOf(callback) && specCallbackList.push(callback);
    },
    off: function(type, callback){
        var specCallbackList = callbackList[type];
        var idx = specCallbackList.indexOf(callback);
        ~idx && specCallbackList.splice(idx, 1);
    },
    trigger: function(type, ...args){
        var specCallbackList = callbackList[type];
        specCallbackList && specCallbackList.forEach(function(callback, idx){
            callback.apply(null, args);
        });
    }
}
