/**
 * 简易编辑器主接口
 */
define(
    ['util', 'ace/ace', './handler', './language', './template'],
    function (util, ace, handler, language, template) {

        // 单例对象
        var app = {
            // 当前操作目录
            path: '',
            // 文件操作句柄
            fs: null,
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
         */
        function initialize(path, file, fs) {
            // 导入单例数据
            app.path = path;
            app.fs = fs;
            // 展开图形界面
            util.displayScreen(true);
            // 添加class
            util.screen.addClass('app-studio');
            // 导入html
            util.screen.html(template.main({menu: language.menu}));
            // 注册事件代理
            for (var key in handler) {
                if (key.indexOf('_') === 0) {
                    continue;
                }
                util.screen.bind(key, handler[key]);
            }
            util.onKeyDown(handler._keydown);
            // 打开文件
            var code = [
                'function foo(items) {\n',
                '    heheda;\n',
                '    var i;\n',
                '    for (i = 0; i < items.length; i++) {\n',
                '        alert("Ace Rocks " + items[i]);\n',
                '    }\n',
                '}'
            ].join('');
            var editor = ace.edit(util.screen.find('.editor')[0]);
            // console.log(editor);
            editor.setTheme('ace/theme/monokai');
            editor.getSession().setMode('ace/mode/javascript');
            editor.setValue(code, code.length);
            editor.setFontSize(18);
            // editor.setAutoScrollEditorIntoView(true);
            editor.focus();
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
            util.displayScreen(false);
            util.screen.removeClass('app-studio');
            util.screen.html('');
            util.onKeyDown();
            for (var key in handler) {
                if (key.indexOf('_') === 0) {
                    continue;
                }
                util.screen.unbind(key);
            }
            app.path = '';
            app.fs = null;
        }

        return initialize;
    }
);
