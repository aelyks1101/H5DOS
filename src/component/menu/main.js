define(['util', './tpl', './handler'], function (util, tpl, handler) {
    /**
     * menu组件，二级菜单
     * 数据结构：{menu: []}，具体见app/studio/config.js .menu
     * 顶级元素：
     *  {
     *      label: '', // 显示的文字
     *      cmd: '', // 单击时回调的命令标识
     *      item: [], // 菜单子项
     *  }
     * 菜单子项元素：
     *  {
     *      label: '', // 显示的文字
     *      hotkey: '', // 右侧显示的快捷键
     *      checked: boolean, // 该项目是否被选中
     *      cmd: '', // 单击时回调的命令标识
     *      disable: boolean, // 该项是否可用
     *      items: [], // 二级菜单子项
     *      cutline: true // 是否为分割线，如果是，其他属性无用
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
