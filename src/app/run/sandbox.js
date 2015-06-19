define(function (require) {

    var sandbox = {};
    // 沙箱window对象
    sandbox.win = null;
    // 沙箱的document对象
    sandbox.doc = null;
    // 劫持沙箱中的底层方法
    sandbox.override = {console: 'all'};
    // 用于劫持的回调
    sandbox.callback = null;
    // 脚本引入
    sandbox.script = document.createElement('script');
    sandbox.script.type = 'text/javascript';
    sandbox.script.src = 'lib/sandbox.js';
    // 沙箱iframe
    sandbox.iframe = document.createElement('iframe');
    sandbox.iframe.className = 'sandwindow';
    sandbox.iframe.onload = function (evt) {
        sandbox.win = evt.target.contentWindow;
        sandbox.doc = sandbox.win.document;
        sandbox.doc.getElementsByTagName('head')[0].appendChild(sandbox.script);
    };
    sandbox.panel = $('#sandbox');

    /**
     * 沙箱初始化（从沙箱内部触发）
     */
    sandbox.init = function () {
        var me = this;
        me.win.Sandbox.override(me.override, callback);
        function callback(param) {
            if (typeof me.callback === 'function') {
                me.callback(param);
            }
        }
    };

    /**
     * 沙箱启动（从沙箱外部触发）
     */
    sandbox.setup = function () {
        window.Sandbox = this;
        this.panel[0].appendChild(this.iframe);
    };

    /**
     * 运行代码
     * @param {string} code 代码字符串
     * @param {Function} callback 运行期回调和劫持回调
     */
    sandbox.run = function (code, callback) {
        this.callback = callback;
        this.win.Sandbox.execute(code, callback);
    };

    /**
     * 启动或隐藏屏幕
     * @param {boolean} v 是否显示
     * @param {string} title 窗体标题栏，一般是当前执行的脚本文件路径
     */
    sandbox.visible = function (v, title) {
        var me = this;
        if (v) {
            me.doc.body.innerHTML = '';
            me.panel.bind('click', close).find('.title').html(title);
            me.panel.css({display: 'block'});
        }
        else {
            me.panel.unbind('click').css({display: 'none'});
        }
        function close(evt) {
            if (evt.target.dataset.close === 'true') {
                me.visible(false);
            }
        }
    };

    return sandbox;
});
