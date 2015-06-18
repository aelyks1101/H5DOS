/**
 * 工具集 + 最底层事件触发处理
 * 提供核心工具，对js原生对象进行扩展
 * 工具包中每个方法都不调用其他方法，但可能会使用output, location, input, screen属性
 * @param {Object} config 系统配置
 * @return {Object} util工具包
 */
define(['config'], function (config) {

    var win = $(window);
    var screen = $('#screen');
    var screenResizeHandler = null;
    var screenKeydownHandler = null;

    /**
     * 日期格式化扩展
     * @param {Date} format 待格式化日期对象
     * @return {string} 格式化后的时间串
     */
    /* eslint-disable */
    Date.prototype.format = function (format) {
        var o = {
            'M+': this.getMonth() + 1,
            'D+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'c+': this.getMilliseconds()
        };
        if (/(Y+)/.test(format)) {
            format = format.replace(
                RegExp.$1,
                (this.getFullYear() + '').substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return format;
    };
    /* eslint-enable */

    /**
     * 命令行模式时，控制鼠标焦点的事件
     * @param {Object} event 事件句柄
     */
    function commandBlurHandler(event) {
        event.target.focus();
    }

    /**
     * 系统按键事件
     * @param {Object} evt 键盘事件
     * @return {boolean} 阻止冒泡
     */
    function windowKeydownHandler(evt) {
        var key = {
            alt: evt.altKey,
            ctrl: evt.ctrlKey,
            code: evt.keyCode
        };
        if (typeof screenKeydownHandler === 'function') {
            screenKeydownHandler(key);
        }
        if (
            (evt.ctrlKey && evt.keyCode === 83) ||
            (evt.ctrlKey && evt.keyCode === 78)
        ) {
            return false;
        }
    }

    /**
     * 界面窗体resize事件
     * @param {Object} event 事件句柄
     */
    function windowResizeHandler(event) {
        var w = win.width();
        var h = win.height();
        screen.css({
            width: w + 'px',
            height: h + 'px'
        });
        if (typeof screenResizeHandler === 'function') {
            screenResizeHandler({
                width: w,
                height: h
            });
        }
    }

    /**
     * 返回工具包
     */
    return {
        // 系统配置
        config: config,
        // 命令输入框
        output: document.getElementById('output'),
        // 地址框
        location: document.getElementById('location'),
        // 主显示框
        input: document.getElementById('input'),
        // 上传框
        upload: document.getElementById('uploader'),
        // 桌面显示器
        screen: screen,
        /**
         * 绑定作用域
         * @param {Object} obj 作用域对象
         * @param {Function} func 待绑定函数
         * @return {Function} 作用域绑定函数
         */
        bind: function (obj, func) {
            return function (evt) {
                func.call(obj, evt);
            };
        },
        /**
         * 桌面resize分发句柄注册
         * @param {function | null} func 事件句柄
         */
        onScreenResize: function (func) {
            screenResizeHandler = func;
        },
        /**
         * 桌面键盘事件句柄
         * @param {function | null} func 事件句柄
         */
        onKeyDown: function (func) {
            screenKeydownHandler = func;
        },
        /**
         * 拼接路径
         * 将当前路径与用户输入路径拼接成绝对路径，如用户输入相对路径，则将其合并到当前路径
         * 后面；如用户输入绝对路径，则返回用户输入的路径
         * @param {string} path 系统当前路径
         * @param {string} to 用户输入的路径
         * @return {string} 拼接后的路径
         */
        joinPath: function (path, to) {
            var dirs = [];
            var n = 0;
            if (typeof path !== 'string') {
                path = '';
            }
            if (typeof to !== 'string') {
                to = '';
            }
            if (to.indexOf('/') === 0) {
                dirs = [];
            }
            else {
                dirs = path.split('/');
            }
            to = to.split('/');
            for (n = 0; n < to.length; n++) {
                if (to[n] === '.') {
                    continue;
                }
                if (to[n] === '..') {
                    dirs.pop();
                    continue;
                }
                dirs.push(to[n]);
            }
            to = [];
            for (n = 0; n < dirs.length; n++) {
                if (dirs[n] !== '') {
                    to.push(dirs[n]);
                }
            }
            path = to.length === 0 ? '' : to.join('/');
            return path;
        },
        /**
         * 获取文件名的扩展名
         * @param {string} str 文件名
         * @return {string} 文件扩展名，不含.
         */
        getFileType: function (str) {
            var type = '';
            if (str.indexOf('.') > -1) {
                var arr = str.split('.');
                type = arr[arr.length - 1];
            }
            return type;
        },
        /**
         * 获取文件的路径
         * @param {string} path 绝对路径
         * @return {string} 文件的路径
         */
        getFilePath: function (path) {
            var rp = '';
            if (path.indexOf('/') > -1) {
                var arr = path.split('/');
                arr.pop();
                rp = arr.join('/');
            }
            return rp;
        },
        /**
         * 检查文件名合法性
         * @param {string} str 文件名
         * @return {boolean} 是否合法
         */
        checkFileName: function (str) {
            var enable = true;
            var chars = ['\\', '/', ':', '*', '?', '"', '<', '>', '\''];
            if (str.length === 0) {
                return false;
            }
            for (var n = 0; n < chars.length; n++) {
                if (str.indexOf(chars[n]) > -1) {
                    enable = false;
                    break;
                }
            }
            return enable;
        },
        /**
         * 显示器推送
         * @param {string} result 显示的内容
         * @param {boolean} showlocation 是否显示前缀
         */
        displayResult: function (result, showlocation) {
            this.output.innerHTML += '<div>'
                + (showlocation ? '<br>' + this.location.innerHTML : '')
                + result + '</div>';
            window.scrollTo(0, document.body.scrollHeight);
        },
        /**
         * 清理显示器
         */
        displayClear: function () {
            this.output.innerHTML = '';
        },
        /**
         * 修改命令
         * @param {string} cmd 命令行
         */
        displayCommand: function (cmd) {
            this.input.value = cmd;
        },
        /**
         * 修改目录
         * @param {string} loc 当前路径
         */
        displayLocation: function (loc) {
            this.location.innerHTML = 'H5:/' + loc + '>';
        },
        /**
         * 在地址栏显示确认信息
         * @param {string} msg 需要确认的信息
         */
        displayConfirm: function (msg) {
            this.location.innerHTML = msg + '(Y/N):';
        },
        /**
         * 显隐图形界面
         * @param {boolean} show 显示/隐藏
         */
        displayScreen: function (show) {
            if (show) {
                this.input.onblur = null;
                this.screen.css({
                    width: win.width() + 'px',
                    height: win.height() + 'px'
                });
                window.onresize = windowResizeHandler;
                $(document).bind('keydown', windowKeydownHandler);
            }
            else {
                this.input.onblur = commandBlurHandler;
                this.screen.html('').css({
                    width: '0px',
                    height: '0px'
                });
                this.input.focus();
                window.onresize = null;
                $(document).unbind('keydown');
            }
        },
        /**
         * 修改input的长度
         */
        inputResize: function () {
            this.input.size = this.input.value.replace(/[^\u0000-\u00ff]/g, 'aa').length + 2;
        },
        /**
         * 解析命令行
         * @param {string} cmd 用户输入的命令行
         * @return {Object} 命令对象
         */
        formatCommand: function (cmd) {
            var obj = {
                __cmd__: '',
                __arguments__: []
            };
            if (typeof cmd !== 'string' || cmd.length === 0) {
                obj.__cmd__ = '';
            }
            else {
                var arr = cmd.split(' ');
                for (var n = 0; n < arr.length; n++) {
                    if (arr[n].length === 0) {
                        continue;
                    }
                    var key = arr[n];
                    if (obj.__cmd__ === '') {
                        obj.__cmd__ = key.toLowerCase();
                        continue;
                    }
                    else {
                        obj.__arguments__.push(key);
                    }
                }
            }
            // 格式化特殊命令
            if (obj.__cmd__.indexOf('cd..') === 0) {
                obj.__cmd__ = 'cd';
                obj.__arguments__[0] = '..';
            }
            else if (obj.__cmd__.indexOf('cd/') === 0) {
                obj.__cmd__ = 'cd';
                obj.__arguments__[0] = '/';
            }
            else if (obj.__cmd__.indexOf('cd.') === 0) {
                obj.__cmd__ = 'cd';
                obj.__arguments__ = [];
            }
            return obj;
        }
    };
});
