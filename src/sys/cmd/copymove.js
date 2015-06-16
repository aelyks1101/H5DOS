/**
 * 复制与移动命令的执行
 * @param {Function} require require工具
 * @return {Function} 执行接口
 */
define(function (require) {
    /**
     * 复制或移动文件的通用方法
     * 此方法包含了复制或移动文件的通用判断流程
     * @param {Object} exe 核心执行单元
     * @param {Object} util 工具对象
     * @param {Object} me core对象
     * @param {Object} cmd 命令对象
     * @param {string} type 通用命令名
     * @param {Function} callback 命令执行后的回调
     */
    return  function (exe, util, me, cmd, type, callback) {
        var callbackHandler = exe.closeCallback(callback);
        if (cmd.__arguments__.length === 0) {
            callbackHandler({});
            return;
        }
        var source = util.joinPath(me._path, cmd.__arguments__[0]);
        var dest = cmd.__arguments__.length > 1
            ? util.joinPath(me._path, cmd.__arguments__[1]) : me._path;
        if (me._confirm === 'Y') {
            me._confirm = '';
            move();
        }
        else if (me._confirm === 'N') {
            me._confirm = '';
            callbackHandler({});
        }
        else {
            exe.isFile(me, source, isFile ,move);
        }
        function move() {
            exe.doubleArguments(me, source, dest, type, callback);
        }
        function exist() {
            me._confirm = '?';
            util.displayConfirm(me._language['target-file-exist']);
        }
        function isFile(fileEntry) {
            exe.isFile(me, dest + '/' + fileEntry.name, exist, move);
        }
    };
});
