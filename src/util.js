/**
 * 工具集
 * 提供核心工具，对js原生对象进行扩展
 * 工具包中每个方法都不调用其他方法，但可能会使用output, location, input, screen属性
 */
define(function (require) {

    var win = $(window);
    var screen = $('#screen');

    /**
     * 日期格式化扩展
     * @param {Date} format 待格式化日期对象
     */
    Date.prototype.format = function(format){ 
        var o = {
            "M+": this.getMonth() + 1,
            "D+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "c+": this.getMilliseconds()
        }
        if (/(Y+)/.test(format)) {
            format = format.replace(
                RegExp.$1,
                (this.getFullYear() + '').substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return format;
    };

    /**
     * 命令行模式时，控制鼠标焦点的事件
     * @param {Object} event 事件句柄
     */
    function commandBlurHandler(event) {
        event.target.focus();
    }
    /**
     * 界面窗体resize
     * @param {Object} event 事件句柄
     */
    function windowResizeHandler(event) {
        screen.css({
            width: win.width() + 'px',
            height: win.height() + 'px'
        });
    }

    /**
     * 返回工具包
     */
    return {
        // 命令输入框
        output: document.getElementById('output'),
        // 地址框
        location: document.getElementById('location'),
        // 主显示框
        input: document.getElementById('input'),
        // 桌面显示器
        screen: screen,
        /**
         * 拼接路径
         * 将当前路径与用户输入路径拼接成绝对路径，如用户输入相对路径，则将其合并到当前路径
         * 后面；如用户输入绝对路径，则返回用户输入的路径
         * @param {string} path 系统当前路径
         * @param {string} to 用户输入的路径
         * @return {string} 拼接后的路径
         */
        joinPath: function (path, to) {
            var str = '';
            if (typeof path !== 'string') {
                path = '';
            }
            if (typeof to !== 'string') {
                to = '';
            }
            // 根目录
            if (to.indexOf('/') === 0) {
                str = to.substr(1, to.length);
            }
            // 当前目录的上一层目录
            else if (to.indexOf('..') === 0) {
                if (path.indexOf('/') > -1) {
                    path = path.split('/');
                    path.pop();
                    str = path.join('/');
                }
                else {
                    str = '';
                }
            }
            // 当前目录
            else if (to.indexOf('.') === 0) {
                str = path;
            }
            // 拼接目录
            else {
                str = path + (path === '' ? '' : '/') + to;
            }
            // 去除无用分隔符
            if (str.charAt(str.length - 1) === '/') {
                str = str.substr(0, str.length - 1);
            }
            if (str.charAt(0) === '/') {
                str = str.substr(1, str.length);
            }
            return str;
        },
        /**
         * 显示器推送
         * @param {string} result 显示的内容
         * @param {boolean} showlocation 是否显示前缀
         */
        displayResult: function (result, showlocation) {
            this.output.innerHTML += (showlocation ? this.location.innerHTML : '')
                + result + '<br><br>';
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
                    height:  win.height() + 'px'
                });
                window.onresize = windowResizeHandler;
            }
            else {
                this.input.onblur = commandBlurHandler;
                this.screen.html('').css({
                    width: '0px',
                    height: '0px'
                });
                this.input.focus();
                window.onresize = null;
            }
        },
        /**
         * 解析命令行
         * @param {string} cmd 用户输入的命令行
         * @return {Object} 命令对象
         */
        formatCommand: function (cmd) {
            var obj = {
                '__cmd__' :'',
                '__arguments__': []
            };
            if (typeof cmd !== 'string' || cmd.length === 0) {
                obj['__cmd__'] = '';
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
                        obj['__arguments__'].push(key);
                    }
                }
            }
            // 格式化特殊命令
            if (obj.__cmd__.indexOf('cd..') === 0) {
                obj.__cmd__ = 'cd';
                obj.__arguments__[0] = '..';
            }
            else if (obj.__cmd__.indexOf('cd.') === 0) {
                obj.__cmd__ = 'cd';
                obj.__arguments__ = [];
            }
            return obj;
        }
    };
});
