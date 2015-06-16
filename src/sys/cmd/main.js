/**
 * 命令解析器封包
 */
define(
    ['./dir', './upload', './download', './copymove', './ren', './help'],
    function (dir, upload, download, copymove, ren, help) {
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
            ren: ren,
            help: help
        };
    }
);
