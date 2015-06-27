/**
 * 简易编辑器主接口
 */
define(
    ['util', './ui', './handler', './template', './config'],
    function (util, ui, handler, template, config) {

        // 单例对象
        var app = {
            // 状态记录仪器，存储在本地文件中
            record: null,
            // 当前操作目录
            path: '',
            // 文件操作句柄
            fs: null,
            // ui操作句柄
            ui: ui,
            // 退出编辑器
            quit: function () {
                quit();
            }
        };

        // 绑定上下文
        for (var key in handler) {
            if (typeof handler[key] !== 'function') {
                continue;
            }
            handler[key] = util.bind(app, handler[key]);
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
                treeStatus: app.record['explorer-tree-status']
            });
            ui.menu.initialize('.menu', uiCallback);
            ui.editor = ui.ace.edit(util.screen.find('.editor')[0]);
            ui.editor.$blockScrolling = Infinity;
            ui.editor.setTheme('ace/theme/monokai');
            ui.editor.getSession().setMode('ace/mode/javascript');
            ui.editor.setFontSize(18);
            ui.editor.focus();
            // 显示ui组件
            ui.menu.show(config);
            ui.explorer.show({});
            showCode();
        }

        /**
         * 显示代码
         * @param {string} code 代码串，格式化好的
         */
        function showCode(code) {
            code = [
                'function foo(items) {\n',
                '    heheda;\n',
                '    var i;\n',
                '    for (i = 0; i < items.length; i++) {\n',
                '        alert("Ace Rocks " + items[i]);\n',
                '    }\n',
                '}'
            ].join('');
            ui.editor.setValue(code, code.length);
        }

        /**
         * ui回调
         * @param {Object} evt 事件对象
         */
        function uiCallback(evt) {
            if (evt.type === 'log') {
                app.record[evt.key] = evt.content;
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
            // var str = JSON.stringify(app.record);
            var file = app.record.__logfile;
            delete app.record.__logfile;
            app.fs.write(file, {data: new Blob([JSON.stringify(app.record)])}, release);
            function release() {
                util.displayScreen(false);
                util.screen.removeClass('app-studio');
                util.screen.html('');
                util.onKeyDown();
                var key = '';
                for (key in handler) {
                    if (key.indexOf('_') === 0) {
                        continue;
                    }
                    util.screen.unbind(key);
                }
                for (key in ui) {
                    if (typeof ui[key].dispose === 'function') {
                        ui[key].dispose();
                    }
                }
                app.path = '';
                app.fs = null;
                app.record = null;
            }
        }

        // 返回接口
        return initialize;
    }
);
