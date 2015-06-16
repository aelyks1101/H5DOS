/**
 * 命令解析器封包
 * @param {Function} dir dir命令解析接口
 * @param {Function} upload upload命令解析接口
 * @param {Function} download download命令解析接口
 * @param {Function} copymove copy和move命令解析接口
 * @return {Object} 外部解析器对象
 */
define(
    ['./dir', './upload', './download', './copymove', './ren'],
    function (dir, upload, download, copymove, ren) {
        return {
            dir: dir,
            upload: upload,
            download: download,
            copy: function (exe, util, me, cmd, callback) {
                copymove(exe, util, me, cmd, 'copy', callback);
            },
            move: function (exe, util, me, cmd, callback) {
                copymove(exe, util, me, cmd, 'move', callback);
            },
            ren: ren
        };
    }
);
