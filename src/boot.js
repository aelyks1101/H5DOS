/*global FileError, console*/
// require 配置
require.config({
    paths: {
        doT: '../lib/doT',
        filesystem: '../lib/filesystem'
    }
});
// 主启动入口
define(
    [
        'config', 'util',
        'app/main',
        'sys/core', 'sys/handler', 'filesystem'
    ],
    function (config, util, app, core, Handler, FileSystem) {
        var handlers = new Handler(core, app, util);
        var language = core._language;
        core._fs = new FileSystem({
            type: config.fsType,
            size: config.fsSize,
            debug: config.fsDebug,
            onSuccess: fsSuccessHandler,
            onFail: fsFailHandler
        });
        /**
         * 申请空间处理句柄
         * @param {Object} _fs 文件系统操作句柄
         */
        function fsSuccessHandler(_fs) {
            util.input.onkeyup = keyupHandler;
            util.input.focus();
            util.displayScreen(false);
            util.displayLocation('');
            util.displayResult(language.welcome + _fs._fs.root.toURL() + '</div>');
        }
        /**
         * 申请空间处理句柄
         * @param {Object} evt error对象
         */
        function fsFailHandler(evt) {
            util.displayResult(evt.message);
        }
        /**
         * 按键抬起处理句柄
         * @param {Object} event 键盘事件
         */
        function keyupHandler(event) {
            var code = event.which;
            var cmd = event.target.value;
            util.inputResize();
            switch (code) {
                case 13: // enter
                    event.target.value = '';
                    handlers.enterPressHandler(cmd, function () {
                        console.log(core._commands[core._commands.length - 1]);
                    });
                    break;
                case 38:
                    handlers.upArrow();
                    break;
                case 40:
                    handlers.downArrow();
                    break;
                default:
                    break;
            }
        }
    }
);
