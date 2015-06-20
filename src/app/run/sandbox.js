define(function (require) {

    // 沙箱对象
    var sandbox = {};
    // 沙箱window对象
    sandbox.win = null;
    // 沙箱的document对象
    sandbox.doc = null;
    // 劫持沙箱中的底层方法
    sandbox.override = {console: 'all'};
    // 用于劫持的回调
    sandbox.callback = null;
    sandbox.panel = $('#sandbox');
    // 脚本引入
    sandbox.script = document.createElement('script');
    sandbox.script.type = 'text/javascript';
    sandbox.script.src = 'lib/sandbox.js';
    // 沙箱iframe
    sandbox.iframe = document.createElement('iframe');
    sandbox.iframe.className = 'sandwindow';
    /**
     * 脚本加载完毕
     */
    sandbox.script.onload = function () {
        sandbox.win.Sandbox.override(sandbox.override, callback);
        function callback(param) {
            if (typeof sandbox.callback === 'function') {
                sandbox.callback(param);
            }
        }
    };
    /**
     * iframe加载完毕
     * @param {Object} evt load事件
     */
    sandbox.iframe.onload = function (evt) {
        sandbox.win = evt.target.contentWindow;
        sandbox.doc = sandbox.win.document;
        sandbox.doc.getElementsByTagName('head')[0].appendChild(sandbox.script);
    };
    /**
     * 初始化沙箱
     */
    sandbox.setup = function () {
        // 注册全局
        window.Sandbox = this;
        // 装载iframe
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
            $(document).bind('keydown', windowKeydownHandler);
        }
        else {
            me.panel.unbind('click').css({display: 'none'});
            $(document).unbind('keydown');
        }
        function close(evt) {
            if (evt === true || evt.target.dataset.close === 'true') {
                me.visible(false);
            }
        }
        function windowKeydownHandler(evt) {
            if (evt.altKey && evt.keyCode === 81) {
                close(true);
            }
        }
    };

    return sandbox;
});
