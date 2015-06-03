
define(function (require) {

    /**
     * 处理键盘事件和鼠标事件的句柄
     * @constructor
     * @param {Object} core 命令解释运行核心
     * @param {Object} util 系统工具包
     */
    function Handler(core, util, language) {
        this.core = core;
        this.util = util;
        this.language = language;
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
    };
    /**
     * 回车键盘
     * @param {string} cmd 命令字符串
     */
    Handler.prototype.enterPressHandler = function (cmd) {
        if (cmd === '') {
            return;
        }
        if (this.core._confirm === '?') {
            this.util.displayResult(cmd, true);
            if (cmd === 'Y' || cmd === 'y') {
                this.core._confirm = 'Y';
                cmd = this.core._commands[this.core._commands.length - 1];
                cmd = this.util.formatCommand(cmd);
                this.util.displayLocation(this.core._path);
                this.core[cmd.__cmd__](cmd);
            }
            else {
                this.core._confirm = '';
                this.util.displayLocation(this.core._path);
            }
            return;
        }
        else {
            this.core._commands.push(cmd);
            this.core._cmdIndex = -1;
            this.util.displayResult(cmd, true);
            cmd = this.util.formatCommand(cmd);
            if (typeof this.core[cmd.__cmd__] === 'function') {
                this.core[cmd.__cmd__](cmd);
            }
            else {
                this.util.displayResult(cmd.__cmd__+ ' ' + this.language.notCommand);
            }
        }
    };
    
    return Handler;

});
