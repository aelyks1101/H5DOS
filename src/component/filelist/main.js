define(['util', './tpl', './handler'], function (util, tpl, handler) {

    // 接口
    var exports = {
        _util: util, // 工具集
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
     * @param {string} container 容器筛选仪
     * @param {Function} callback 回调函数
     */
    exports.initialize = function (container, callback) {
        this._container = container;
        this._callback = callback;
    };
    /**
     * 显示，导入到screen
     * @param {Object} data 模板渲染数据
     */
    exports.show = function (data) {
        var html = tpl(data);
        if (exports._container != null) {
            util.screen.find(exports._container).html(html);
        }
        else {
            util.screen.html(html);
        }
    };
    /**
     * 卸载
     */
    exports.dispose = function () {
        this._container = null;
        this._callback = null;
    };

    // 返回实例
    return exports;
});
