/**
 * 命令解析器封包
 * @param {Function} dir dir命令解析接口
 * @param {Function} uploader upload命令解析接口
 * @return {Object} 外部解析器对象
 */
define(['./dir', './uploader'], function (dir, uploader) {
    return {
        dir: dir,
        uploader: uploader
    };
});
