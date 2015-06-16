/**
 * 复制与移动命令的执行
 * @param {Function} require require工具
 * @return {Function} 执行接口
 */
define(function (require) {
    /**
     * ren
     * @param {Object} exe 核心执行单元
     * @param {Object} util 工具对象
     * @param {Object} me core对象
     * @param {Object} cmd 命令对象
     * @param {Function} callback 命令执行后的回调
     */
    return function (exe, util, me, cmd, callback) {
        var callbackHandler = exe.closeCallback(callback);
        if (cmd.__arguments__.length < 2) {
            callbackHandler({});
            return;
        }
        var source = util.joinPath(me._path, cmd.__arguments__[0]);
        var dest = cmd.__arguments__[1];
        if (dest.indexOf('/') > -1) {
            var arr = dest.split('/');
            dest = arr[arr.length - 1];
        }
        if (typeof dest !== 'string' || dest.length === 0) {
            callbackHandler({});
            return;
        }
        if (me._confirm === 'Y') {
            me._confirm = '';
            ren();
        }
        else if (me._confirm === 'N') {
            me._confirm = '';
            callbackHandler({});
        }
        else {
            exe.isFile(me, source, isFile, ren);
        }
        function gotEntry(evt) {
            if (exe.isOK(evt)) {
                util.displayLocation(me._path);
            }
            callbackHandler(evt);
        }
        function ren() {
            me._fs.ren(source, dest, gotEntry);
        }
        function exist() {
            me._confirm = '?';
            util.displayConfirm(me._language['target-file-exist']);
        }
        function isFile(fileEntry) {
            if (fileEntry.name === dest) {
                callbackHandler({});
            }
            else {
                var target = source.split('/');
                target[target.length - 1] = dest;
                target = target.join('/');
                exe.isFile(me, target, exist, ren);
            }
        }
    };
});
