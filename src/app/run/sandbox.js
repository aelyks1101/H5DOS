define(function (require) {

    var sandbox = {};
    // 沙箱window对象
    sandbox.win = null;
    // 沙箱的document对象
    sandbox.doc = null;
    // 劫持沙箱中的底层方法
    sandbox.override = {
        alert: true,
        console: 'all'
    };
    // 用于劫持的回调
    sandbox.callback = null;
    // 脚本引入
    sandbox.script = document.createElement('script');
    sandbox.script.type = 'text/javascript';
    sandbox.script.src = 'lib/sandbox.js';
    // 沙箱iframe
    sandbox.iframe = document.createElement('iframe');
    sandbox.iframe.style.display = 'none';
    sandbox.iframe.onload = function (evt) {
        sandbox.win = evt.target.contentWindow;
        sandbox.doc = sandbox.win.document;
        sandbox.doc.getElementsByTagName('head')[0].appendChild(sandbox.script);
    };
    /**
     * 运行代码
     * @param {string} code 代码字符串
     * @param {Function} callback 运行期回调和劫持回调
     */
    sandbox.run = function (code, callback) {
        this.callback = callback;
        this.win.execute(code, callback);
    };
    /**
     * 沙箱初始化（从沙箱内部触发）
     */
    sandbox.init = function () {
        var me = this;
        me.win.override(me.override, callback);
        function callback(param) {
            if (typeof me.callback === 'function') {
                me.callback(param);
            }
        }
    };

    return sandbox;
});
