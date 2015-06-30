define(['util', './tpl', './handler'], function (util, tpl, handler) {

    // 接口
    var exports = {
        _util: null, // 工具集
        _container: null, // 容器筛选仪
        _callback: null, // 回调函数
        _handler: null // 事件句柄
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
     * @param {string} container 容器筛选仪
     * @param {Function} callback 回调函数
     */
    exports.initialize = function (container, callback) {
        this._container = container;
        this._callback = callback;
        this._util = util;
        this._handler = handler;
    };

    /**
     * 显示，导入到screen
     * @param {Object} data 模板渲染数据
     */
    exports.show = function (data) {
        var html = produceHTML(data.tree, data.status, data.showfile);
        util.screen.find(exports._container).html(html);
    };

    /**
     * 卸载
     */
    exports.dispose = function () {
        this._container = null;
        this._callback = null;
        this._util = null;
        this._handler = null;
    };

    /**
     * 生成树html
     * @param {Object} tree 树的数据结构
     * @param {Object} status 文件夹打开关闭状态
     * @param {boolean} showfile 是否显示文件
     * @return {string} 文件树html
     */
    function produceHTML(tree, status, showfile) {
        var key;
        for (key in tree) {
            if (tree[key].isFile) {
                tree[key].html = showfile ? tpl.file(tree[key]) : '';
            }
        }
        for (key in tree) {
            if (typeof tree[key].html === 'string') {
                continue;
            }
            producing(tree[key]);
        }
        function producing(folder) {
            if (folder.children.length === 0) {
                if (status[folder.fullPath]) {
                    folder.open = true;
                }
                folder.html = tpl.directory(folder);
            }
            else {
                for (var n = 0; n < folder.children.length; n++) {
                    if (typeof folder.children[n] !== 'string') {
                        continue;
                    }
                    var child = tree[folder.children[n]];
                    if (child) {
                        folder.children[n] = child;
                        if (typeof child.html !== 'string') {
                            producing(child);
                        }
                    }
                }
                if (status[folder.fullPath]) {
                    folder.open = true;
                }
                folder.html = tpl.directory(folder);
            }
        }
        return tpl.tree(tree['/']);
    }

    // 返回实例
    return exports;
});
