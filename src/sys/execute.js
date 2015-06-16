/**
 * 核心执行单元
 * @param {Object} util 工具包
 * @return {Object} 执行对象
 */
define(['util'], function (util) {
    return {
        /**
         * 产生callback闭包，封装判断逻辑
         * @param {Function} callback 原始函数
         * @return {Function} 闭包
         */
        closeCallback: function (callback) {
            return function (evt) {
                if (typeof callback === 'function') {
                    callback(evt);
                }
            };
        },
        /**
         * 错误检测，同时负责错误信息屏显
         * @param {Object} evt fs回调回传
         * @param {boolean} dontdisplay 是否不显示
         * @return {boolean} 是否为错误信息
         */
        isOK: function (evt, dontdisplay) {
            var isOK = true;
            if (evt.error) {
                isOK = false;
                var msg = evt.message;
                if (msg.length === 0) {
                    msg = evt.name.charAt(0);
                    for (var n = 1; n < evt.name.length; n++) {
                        if (evt.name.charAt(n) < 'A' || evt.name.charAt(n) > 'Z') {
                            msg += evt.name.charAt(n);
                        }
                        else {
                            msg += ' ' + evt.name.charAt(n);
                        }
                    }
                    msg += '.';
                }
                if (!dontdisplay) {
                    util.displayResult(msg);
                }
            }
            return isOK;
        },
        /**
         * 检测文件是否存在
         * @param {Object} me core对象
         * @param {string} path 路径
         * @param {Function} is 存在的回调
         * @param {Function} not 不存在的回调
         */
        isFile: function (me, path, is, not) {
            var exe = this;
            me._fs.open(path, gotEntry);
            function gotEntry (evt) {
                if (exe.isOK(evt, true)) {
                    if (typeof is === 'function') {
                        is(evt);
                    }
                }
                else {
                    if (typeof not === 'function') {
                        not(evt);
                    }
                }
            }
        },
        /**
         * 执行单一参数的一次性命令
         * md, rd, del
         * @param {Object} me core对象
         * @param {Object} cmd 命令对象
         * @param {string} func 通用命令名
         * @param {Function} callback 命令执行后的回调
         */
        singleArgument: function (me, cmd, func, callback) {
            var exe = this;
            var callbackHandler = exe.closeCallback(callback);
            if (cmd.__arguments__.length === 0 || typeof me._fs[func] !== 'function') {
                callbackHandler({});
                return;
            }
            var path = util.joinPath(me._path, cmd.__arguments__[0]);
            me._fs[func](path, gotEntry);
            function gotEntry(evt) {
                if (exe.isOK(evt)) {
                    util.displayLocation(me._path);
                }
                callbackHandler(evt);
            }
        },
        /**
         * 执行二个参数的一次性命令
         * copy, move, ren
         * @param {Object} me core对象
         * @param {string} argm1 第一个路径
         * @param {string} argm2 第二个路径
         * @param {string} func 通用命令名
         * @param {Function} callback 命令执行后的回调
         */
        doubleArguments: function (me, argm1, argm2, func, callback) {
            var exe = this;
            var callbackHandler = exe.closeCallback(callback);
            if (typeof me._fs[func] !== 'function') {
                callbackHandler({});
                return;
            }
            me._fs[func](argm1, argm2, gotEntry);
            function gotEntry(evt) {
                if (exe.isOK(evt)) {
                    util.displayLocation(me._path);
                }
                callbackHandler(evt);
            }
        }
    };
});
