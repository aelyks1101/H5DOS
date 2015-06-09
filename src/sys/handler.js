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
        if (this.core._confirm === '?') {
            this.util.displayResult(cmd, true);
            if (cmd === 'Y' || cmd === 'y') {
                this.core._confirm = 'Y';
            }
            else {
                this.core._confirm = 'N';
            }
            cmd = this.core._commands[this.core._commands.length - 1];
            cmd = this.util.formatCommand(cmd);
            this.util.displayLocation(this.core._path);
            this.core[cmd.__cmd__](cmd, callback);
            return;
        }
        else {
            this.core._commands.push(cmd);
            this.core._cmdIndex = -1;
            this.util.displayResult(cmd, true);
            cmd = this.util.formatCommand(cmd);
            if (typeof this.core[cmd.__cmd__] === 'function') {
                this.core[cmd.__cmd__](cmd, callback);
            }
            else if (typeof this.app[cmd.__cmd__] === 'function') {
                var path = this.core._path;
                var file = '';
                if (cmd.__arguments__.length) {
                    file = this.util.joinPath(this.core._path, cmd.__arguments__[0]);
                }
                this.app[cmd.__cmd__](path, file, this.core._fs);
            }
            else {
                // 检查可执行或可打开文件
                this.util.displayResult(cmd.__cmd__+ ' ' + this.language.notCommand);
            }
        }

    };

    return Handler;

});
