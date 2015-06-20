(function(){
    var Sandbox = {};
    /**
     * 重载系统函数
     * @param {Object} opt 需要覆盖的window方法
     * @param {Function} callback 替换的处理函数
     */
    Sandbox.override = function (opt, callback) {
        var method = '';
        var property = '';
        // 覆盖方法
        for (method in opt) {
            if (!window[method]) {
                continue;
            }
            if (opt[method] === true) {
                window[method] = _closure(method, '', callback);
            }
            else if (opt[method] === 'all') {
                for (property in window[method]) {
                    if (property.indexOf('_') > -1) {
                        continue;
                    }
                    window[method][property] = _closure(method, property, callback);
                }
            }
            else if (opt[method] instanceof Array) {
                for (var n = 0; n < opt[method].length; n++) {
                    property = opt[method][n];
                    if (!window[method][property]) {
                        continue;
                    }
                    window[method][property] = _closure(method, property, callback);
                }
            }
        }
        // 添加新方法
        window.OpenScreen = function () {
            callback({openscreen: true});
        };
        window.CloseScreen = function () {
            callback({openscreen: false});
        };
        /**
         * 内部方法制作闭包
         * @param {string} method 一级对象
         * @param {string} property 对象方法
         * @param {Function} callback 劫持回调
         */
        function _closure(method, property, callback) {
            return function () {
                var obj = {
                    method: method,
                    property: property,
                    arguments: []
                };
                for (var n = 0; n < arguments.length; n++) {
                    obj.arguments.push(arguments[n]);
                }
                if (typeof callback === 'function') {
                    callback(obj);
                }
            };
        }
    }
    /**
     * 执行外部代码
     * @param {string} code 代码串
     * @param {Function} callback 运行期回调，主要用于回传编译错误
     */
    Sandbox.execute = function (code, callback) {
        // 编译代码
        var func;
        try {
            func = new Function(code);
        }
        catch (e) {
            callback({error: true, target: e});
        }
        // 执行代码
        if (typeof func === 'function') {
            try {
                func();
            }
            catch (e) {
                callback({error: true, target: e});
            }
        }
    }
    // 注册作用域
    window.Sandbox = Sandbox;
})();
