/**
 * 简易编辑器主接口
 * main.js主要复杂应用的生命周期
 */
define(
    ['./handler', './language', './template', './service'],
    function (handler, language, template, service) {
        /**
         * 构造函数
         * @param {Object} util 主控工具集
         */
        function Main(util) {
            this.util = util;
            this.initialize();
        }
        /**
         * 初始化
         */
        Main.prototype.initialize = function () {
            var me = this;
            me.util.displayScreen(true);
            me.util.screen.html('<input type="text" id="appEdit"/>');
            document.getElementById('appEdit').focus();
            setTimeout(function () {
                me.dispose();
            }, 3000);
        };
        /**
         * 卸载
         */
        Main.prototype.dispose = function () {
            this.util.displayScreen(false);
        };

        return Main;
    }
);
