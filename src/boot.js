/*global console*/
// require 配置
require.config({
    paths: {
        ace: '../lib/ace',
        zip: '../lib/jszip.min',
        saver: '../lib/FileSaver',
        doT: '../lib/doT',
        filesystem: '../lib/FileSystem'
    }
});
// 主启动入口
define(
    ['util', 'app/main', 'sys/core', 'sys/handler', 'filesystem'],
    function (util, app, core, Handler, FileSystem) {
        var handlers = new Handler(core, app, util);
        var language = core._language;
        core._fs = new FileSystem({
            type: util.config.fsType,
            size: util.config.fsSize,
            debug: util.config.fsDebug,
            hidden: util.config.hidden,
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
            // 检查并创建系统文件夹，
            _fs.md('.sys', function (evt) {
                // autorun
                handlers.enterPressHandler(app.__registry__.autorun[0]);
            });
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
                    handlers.enterPressHandler(cmd);
                    break;
                case 38: // up
                    handlers.upArrow();
                    break;
                case 40: // down
                    handlers.downArrow();
                    break;
                default:
                    break;
            }
        }
    }
);
