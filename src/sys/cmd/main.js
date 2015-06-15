/**
 * 命令解析器封包
 * @param {Function} dir dir命令解析接口
 * @param {Function} upload upload命令解析接口
 * @param {Function} download download命令解析接口
 * @return {Object} 外部解析器对象
 */
define(['./dir', './upload', './download'], function (dir, upload, download) {
    return {
        dir: dir,
        upload: upload,
        download: download
    };
});
