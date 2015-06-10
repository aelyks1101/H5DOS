/**
 * 简易编辑器主接口
 */
define(
    ['util', './handler', './language', './template'],
    function (util, handler, language, template) {

        // 单例对象
        var app = {
            // 当前操作目录
            path: '',
            // 当前操作文件
            file: '',
            // 当前操作文件的内容
            content: '',
            // 文件操作句柄
            fs: null,
            // 新建文件
            newFile: function () {
                newFile();
            },
            // 保存文件
            save: function () {
                save();
            },
            // 退出编辑器
            quit: function () {
                quit();
            },
            // 绘制界面
            resize: function (evt) {
                resize(evt);
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
            app.file = file;
            app.fs = fs;
            // 展开图形界面
            util.displayScreen(true);
            // 添加class
            util.screen.addClass('app-edit');
            // 导入html
            util.screen.html(template.main(language));
            // 注册事件代理
            for (var key in handler) {
                if (key.indexOf('_') === 0) {
                    continue;
                }
                util.screen.bind(key, handler[key]);
            }
            util.onKeyDown(handler._keydown);
            util.onScreenResize(handler._resize);
            // 设置焦点
            util.screen.find('.content')[0].focus();
            // 初始化界面
            resize({
                width: util.screen.width(),
                height: util.screen.height()
            });
            // 打开文件
            open();
        }

        /**
         * 新建
         */
        function newFile() {
            var content = value();
            if (app.content === content) {
                app.file = '';
                app.content = '';
                value('');
            }
            else {
                if (window.confirm(language.discardchange)) {
                    save(newFile);
                }
                else {
                    app.file = '';
                    app.content = '';
                    value('');
                }
            }
        }

        /**
         * 保存
         * @param {Function} callback 保存成功后的回调
         */
        function save(callback) {
            var content = value();
            if (app.content === content) {
                return;
            }
            if (app.file === '') {
                inputFilename(saving);
            }
            else {
                app.fs.write(app.file, {data: new Blob([content])}, saved);
            }
            function saving (path) {
                app.file = path;
                app.fs.write(app.file, {data: new Blob([content])}, saved);
            }
            function saved(evt) {
                if (evt.error) {
                    alert(evt.message || evt.name);
                }
                else {
                    app.content = content;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        }

        /**
         * 退出
         */
        function quit() {
            var content = value();
            if (app.content === content) {
                dispose();
            }
            else {
                if (window.confirm(language.unsaved)) {
                    dispose();
                }
            }
        }

        /**
         * 用户输入文件名
         * @param {Function} callback 输入的文件名合法后的回调
         */
        function inputFilename(callback) {
            var file;
            input(language.noname);
            function input(msg) {
                file = window.prompt(msg);
                if (typeof file === 'string') {
                    file = file.replace(/ /g, '');
                }
                if (typeof file !== 'string' || file.length === 0) {
                    return;
                }
                if (!util.checkFilename(file)) {
                    input(language.unablename + '\n' + language.noname);
                }
                else {
                    app.fs.open(app.path + '/' + file, tryOpen);
                }
            }
            function tryOpen(evt) {
                if (evt.error) {
                    callback(app.path + '/' + file);
                }
                else {
                    if (window.confirm(file + language.fileexist)) {
                        callback(app.path + '/' + file);
                    }
                    else {
                        input(language.noname);
                    }
                }
            }
        }

        /**
         * 获取或设置文本内容
         * @param {string} str 要显示的utf8字符串
         * @return {string} 编辑器内容的utf8字符串
         */
        function value(str) {
            var v = '';
            if (typeof str === 'string') {
                app.content = str;
                util.screen.find('.content').val(str);
                v = null;
            }
            else {
                v = util.screen.find('.content')[0].value;
            }
            return v;
        }

        /**
         * 打开文件
         */
        function open() {
            if (app.file === '') {
                return;
            }
            app.fs.read(app.file, {}, function (evt) {
                if (!evt.error) {
                    value(evt.target.result);
                }
            });
        }

        /**
         * 设置app各种尺寸
         * @param {Object} evt 尺寸对象
         */
        function resize(evt) {
            util.screen.find('.content').css({
                height: evt.height - 35 + 'px',
                width: evt.width - 2 + 'px'
            });
        }

        /**
         * 卸载
         */
        function dispose() {
            util.displayScreen(false);
            util.screen.removeClass('app-edit');
            util.onScreenResize();
            util.onKeyDown();
            for (var key in handler) {
                if (key.indexOf('_') === 0) {
                    continue;
                }
                util.screen.unbind(key);
            }
            app.path = '';
            app.content = '';
            app.fs = null;
        }

        return initialize;
    }
);
