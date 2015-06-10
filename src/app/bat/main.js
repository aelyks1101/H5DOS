/**
 * 简易编辑器主接口
 * @return {Function} bat执行器接口
 */
define(function () {
    /**
     * 初始化
     * @param {string} path bat文件绝对路径
     * @param {Object} core 系统核心
     * @param {Object} util 系统工具集
     */
    function initialize(path, core, util) {
        core._fs.read(path, {}, gotContent);
        /**
         * 读取到bat文件内容
         * @param {Object} evt 文件读取句柄
         */
        function gotContent(evt) {
            exe(0, evt.target.result.split('\n'));
        }
        /**
         * 执行命令
         * @param {number} index 当前执行的序列
         * @param {Array} cmds 命令队列
         */
        function exe(index, cmds) {
            if (index >= cmds.length) {
                return;
            }
            util.displayResult(cmds[index], true);
            var cmd = util.formatCommand(cmds[index]);
            if (typeof core[cmd.__cmd__] === 'function') {
                core[cmd.__cmd__](cmd, done);
            }
            else {
                util.displayResult(cmd.__cmd__ + ' ' + core._language.notCommand);
            }
            function done() {
                exe(index + 1, cmds);
            }
        }
    }

    return initialize;
});
