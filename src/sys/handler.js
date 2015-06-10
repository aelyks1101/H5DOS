/**
 * 系统级别的交互事件
 */
define(function (require) {

    /**
     * 处理键盘事件和鼠标事件的句柄
     * @constructor
     * @param {Object} core 内部命令运行核心
     * @param {Object} app 应用程序运行核心
     * @param {Object} util 系统工具包
     */
    function Handler(core, app, util) {
        this.core = core;
        this.util = util;
        this.app = app;
        this.language = core._language;
    }

    /**
     * 上键
     */
    Handler.prototype.upArrow = function () {
        if (this.core._commands.length === 0) {
            return;
        }
        if (this.core._cmdIndex < 0) {
            this.core._cmdIndex = this.core._commands.length - 1;
        }
        else {
            this.core._cmdIndex--;
        }
        if (this.core._cmdIndex < 0) {
            this.core._cmdIndex = 0;
        }
        this.util.displayCommand(this.core._commands[this.core._cmdIndex]);
        this.util.inputResize();
    };

    /**
     * 下键
     */
    Handler.prototype.downArrow = function () {
        if (this.core._commands.length === 0) {
            return;
        }
        if (this.core._cmdIndex < 0) {
            this.core._cmdIndex = this.core._commands.length - 1;
        }
        else {
            this.core._cmdIndex++;
        }
        if (this.core._cmdIndex > this.core._commands.length - 1) {
            this.core._cmdIndex = this.core._commands.length - 1;
        }
        this.util.displayCommand(this.core._commands[this.core._cmdIndex]);
        this.util.inputResize();
    };

    /**
     * 回车键盘
     * @param {string} cmd 命令字符串
     * @param {function} callback 命令执行结束的回调
     */
    Handler.prototype.enterPressHandler = function (cmd, callback) {
        if (cmd === '') {
            return;
        }
        var me = this;
        if (me.core._confirm === '?') {
            me.util.displayResult(cmd, true);
            me.core._confirm = (cmd === 'Y' || cmd === 'y') ? 'Y' : 'N';
            cmd = me.util.formatCommand(me.core._commands[me.core._commands.length - 1]);
            me.util.displayLocation(me.core._path);
            me.core[cmd.__cmd__](cmd, callback);
        }
        else {
            me.core._commands.push(cmd);
            me.core._cmdIndex = -1;
            me.util.displayResult(cmd, true);
            cmd = me.util.formatCommand(cmd);
            // 内部命令
            if (typeof me.core[cmd.__cmd__] === 'function') {
                me.core[cmd.__cmd__](cmd, callback);
            }
            // 应用命令
            else if (typeof me.app[cmd.__cmd__] === 'function') {
                me.app[cmd.__cmd__](
                    me.core._path,
                    cmd.__arguments__.length > 0
                        ? me.util.joinPath(me.core._path, cmd.__arguments__[0]) : '',
                    me.core._fs
                );
            }
            // 打开文件
            else {
                me.core._fs.open(me.util.joinPath(me.core._path, cmd.__cmd__), isFile);
            }
        }
        /**
         * 文件检测回调
         * @param {Object} evt 文件打开句柄
         */
        function isFile(evt) {
            if (evt.error) {
                me.util.displayResult(cmd.__cmd__+ ' ' + me.language.notCommand);
            }
            else {
                if (evt.name.indexOf('.') > -1) {
                    var arr = evt.name.split('.');
                    var type = arr[arr.length - 1];
                    var reg = me.app.__registry__;
                    if (reg.docs[type] instanceof Array && reg.docs[type].length > 0) {
                        var app = reg.docs[type][0];
                        if (typeof me.app[app] === 'function') {
                            me.app[app](me.core._path, evt.name, me.core._fs);
                        }
                        else {
                            me.util.displayResult(me.language.regError);
                        }
                    }
                    else {
                        me.util.displayResult(evt.name + ' ' + me.language.cantOpen);
                    }
                }
                else {
                    me.util.displayResult(evt.name + ' ' + me.language.cantOpen);
                }
            }
        }
    };

    return Handler;

});
