define(
    ['util', './tpl', './ui', './handler'],
    function (util, tpl, ui, handler) {

        // 单例数据
        var exports = {
            _util: util, // 工具集
            _ui: ui, // ui插件
            _fs: null, // 文件句柄
            _container: null, // 容器筛选仪
            _callback: null, // 回调函数
            _handler: handler // 事件句柄
        };

        // 绑定事件上下文
        for (var key in handler) {
            if (key.indexOf('_') > -1) {
                continue;
            }
            handler[key] = util.bind(exports, handler[key]);
        }

        // 外部接口
        /**
         * 初始化
         * @param {Object} fs 文件句柄
         * @param {string} container 容器筛选仪
         * @param {Function} callback 回调函数
         */
        exports.initialize = function (fs, container, callback) {
            this._fs = fs;
            this._container = container;
            this._callback = callback;
            // 初始化插件
            this._ui.tree.initialize('.explorer-left', uiCallback);
        };
        /**
         * 显示，导入到screen
         * @param {Object} data 模板渲染数据
         */
        exports.show = function (data) {
            // 导入原始模板
            var html = tpl(data);
            if (exports._container != null) {
                util.screen.find(exports._container).append(html);
            }
            else {
                util.screen.append(html);
            }
            // 导入组件模板
            readTree(['/'], {}, this._ui.tree.show);
        };
        /**
         * 卸载
         */
        exports.dispose = function () {
            this._fs = null;
            this._container = null;
            this._callback = null;
        };

        // 内部方法
        /**
         * ui回调
         * @param {Object} evt 事件对象
         */
        function uiCallback(evt) {
            alert(evt.type + ';' + evt.path);
        }
        /**
         * 读取文件树，生成数据结构
         * @param {Array} works 工作队列
         * @param {Object} tree 数据结构
         * @param {Function} callback 回调函数
         */
        function readTree(works, tree, callback) {
            var key = '';
            if (works.length === 0) {
                // 递归出口
                callback(tree);
            }
            else {
                // 写入目录
                key = works[0];
                var arr = key.split('/');
                tree[key] = {
                    fullPath: key,
                    isDirectory: true,
                    isFile: false,
                    name: arr[arr.length - 1].length ? arr[arr.length - 1] : '',
                    children: []
                };
                // 读取内容
                exports._fs.dir(key, function (evt) {
                    for (var n = 0; n < evt.length; n++) {
                        var path = evt[n].fullPath;
                        // 注册关联
                        tree[key].children.push(path);
                        if (evt[n].isDirectory) {
                            works.push(path);
                            continue;
                        }
                        // 写入文件
                        tree[path] = {
                            fullPath: path,
                            isDirectory: false,
                            isFile: true,
                            name: evt[n].name
                        };
                    }
                    // 递归
                    works.shift();
                    readTree(works, tree, callback);
                });
            }
        }

        // 返回实例
        return exports;
    }
);
