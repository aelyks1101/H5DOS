define(['util', './tpl', './handler'], function (util, tpl, handler) {
    /**
     * 文件列表组件
     * 数据结构：{data: []}
     * 文件元素：
     *  {
     *      fullPath: '', // 绝对路径
     *      isDirectory: boolean, // 是否为目录
     *      isFile: boolean, // 是否为文件
     *      name: '', // 名称，不含路径
     *      type: '', // 文件类型
     *      size: '', // 文件大小，含单位
     *      time: Date  // 文件最后修改日期
     *  }
     */
    // 接口对象
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
        util.screen.find(exports._container).html(tpl(data));
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

    // 返回实例
    return exports;
});
