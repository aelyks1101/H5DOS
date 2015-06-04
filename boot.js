require.config({
    baseUrl: "src",
    paths: {
        doT: '/lib/doT',
        filesystem: '/lib/filesystem',
        config: '../config'
    }
});
define(
    ['config', 'language', 'util', 'core', 'filesystem', 'handler'],
    function (config, Language, util, core, FileSystem, Handler) {

        // 申请文件系统操作句柄
        var language = Language(config.language);
        var handlers = new Handler(core, util, language);
        core._fs = new FileSystem({
            type: config.fsType,
            size: config.fsSize,
            debug: config.fsDebug,
            onSuccess: fsOnSuccessHandler,
            onFail: fsOnFailHandler
        });
        /**
         * 申请空间处理句柄
         * @param {Object} _fs 文件系统操作句柄
         */
        function fsOnSuccessHandler(_fs) {
            util.input.onblur = function () {
                util.input.focus();
            };
            util.input.onkeyup = keyupHandler;
            util.input.focus();
            util.displayLocation('');
            util.displayResult(language.welcome + _fs._fs.root.toURL() + '</div>');
        }
        /**
         * 申请空间处理句柄
         * @param {Object} evt error对象
         */
        function fsOnFailHandler(evt) {
            util.displayResult(evt.message);
        }
        /**
         * 按键抬起处理句柄
         * @param {Object} event 键盘事件
         */
        function keyupHandler(event) {
            var code = event.which;
            var cmd = event.target.value;
            var count = cmd.replace(/[^\u0000-\u00ff]/g,"aa").length;
            event.target.size = count + 2;
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
