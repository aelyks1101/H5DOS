/**
 * 编辑器主接口
 */
define(
    ['util', './cmd/main', './ui', './handler', './template', './config'],
    function (util, cmd, ui, handler, template, config) {

        // 单例对象
        var app = {
            record: null, // 状态记录仪器，存储在本地文件中
            path: '', // 当前操作目录
            ui: null, // ui接口，主要用于handler发放事件方便
            fs: null, // 文件操作句柄
            /**
             * 已打开的文件的数据结构，key为文件fullPath，值为:
             *  {
             *      code: '', 文件内容
             *      type: '', 文件类型
             *      name: '', 文件名
             *      path: '', 文件路径
             *      save: boolean, 是否未保存
             *  }
             */
            codes: {},
            cmd: '', // 将要执行的命令
            hotkey: function (evt) {
                hotkey(evt);
            }
        };

        // 绑定上下文
        for (var key in handler) {
            if (typeof handler[key] !== 'function') {
                continue;
            }
            handler[key] = util.bind(app, handler[key]);
        }
        for (var method in cmd) {
            if (typeof cmd[method] !== 'function') {
                continue;
            }
            cmd[method] = util.bind(app, cmd[method]);
        }

        /**
         * 初始化
         * @param {string} path 当前操作目录
         * @param {string} file 操作文件名
         * @param {Object} fs 文件系统句柄
         * @param {Object} record app在系统中留下的日志和参数
         */
        function initialize(path, file, fs, record) {
            // 导入单例数据
            app.ui = ui;
            app.path = path;
            app.fs = fs;
            app.record = record;
            // 展开图形界面
            util.displayScreen(true);
            // 添加class
            util.screen.addClass('app-studio');
            // 注册事件代理
            for (var key in handler) {
                if (key.indexOf('_') === 0) {
                    continue;
                }
                util.screen.bind(key, handler[key]);
            }
            util.onKeyDown(handler._keydown);
            // 导入HTML
            util.screen.html(template.main({}));
            // 初始化各ui组件
            ui.explorer.initialize({
                fs: fs,
                container: null,
                callback: uiCallback,
                treeStatus: app.record['explorer-tree-status'],
                favoriteDirectory: app.record['explorer-favorite-directory']
            });
            ui.menu.initialize('.menu', uiCallback);
            ui.editor.initialize(util.screen.find('.editor')[0]);
            // 显示ui组件
            ui.menu.show(config);
            if (typeof file === 'string' && file.length > 0) {
                cmd.loadCode(file);
            }
        }

        /**
         * ui回调
         * @param {Object} evt 事件对象
         * @param {string} evt.com 事件触发的component名称
         * @param {string} evt.type 事件类型
         */
        function uiCallback(evt) {
            var str = '';
            switch (evt.type) {
                case 'log':
                    app.record[evt.key] = evt.content;
                    break;
                case 'menu-click':
                    if (typeof cmd[evt.cmd] === 'function') {
                        cmd[evt.cmd](config.language.explorer);
                    }
                case 'open':
                    if (app.cmd === 'openfile' && evt.com === 'explorer') {
                        app.cmd = '';
                        cmd.loadCode(evt.path);
                    }
                    break;
                case 'cancel':
                    break;
                default:
                    for (var key in evt) {
                        if (key.indexOf('_') > -1) {
                            continue;
                        }
                        str += key + ':' + evt[key] + '\n';
                    }
                    alert(str);
                    break;
            }
        }

        /**
         * 处理键盘事件
         * @param {Object} evt 键盘对象
         */
        function hotkey(evt) {
            if (evt.alt && evt.code === 81) {
                quit();
            }
            if (evt.ctrl && evt.code === 83) {
                // save();
            }
            if (evt.alt && evt.code === 78) {
                // newFile();
            }
            if (evt.alt && evt.code === 79) {
                cmd.openfile(config.language.explorer);
            }
            for (var key in app.ui) {
                if (
                    app.ui[key]._handler
                    && typeof app.ui[key]._handler.keydown === 'function'
                ) {
                    app.ui[key]._handler.keydown(evt);
                }
            }
        }

        /**
         * 退出
         */
        function quit() {
            dispose();
        }

        /**
         * 卸载
         */
        function dispose() {
            var file = app.record.__logfile;
            delete app.record.__logfile;
            app.fs.write(file, {data: new Blob([JSON.stringify(app.record)])}, release);
            function release() {
                var key = '';
                for (key in ui) {
                    if (typeof ui[key].dispose === 'function') {
                        ui[key].dispose();
                    }
                }
                util.displayScreen(false);
                util.screen.removeClass('app-studio');
                util.screen.html('');
                util.onKeyDown();
                for (key in handler) {
                    if (key.indexOf('_') === 0) {
                        continue;
                    }
                    util.screen.unbind(key);
                }
                app.ui = null;
                app.path = '';
                app.fs = null;
                app.record = null;
                app.codes = {};
                app.cmd = '';
                app.hotkey = null;
            }
        }

        // 返回接口
        return initialize;
    }
);
