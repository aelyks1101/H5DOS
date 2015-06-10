/**
 * DIR命令执行单元
 * @param {Object} tpl 模板引擎
 * @return {Function} dir命令解析器
 */
define(['sys/template'], function (tpl) {

    /**
     * 命令执行与解析
     * @param {Object} cmd 命令对象
     * @param {Array} entries 目录entries列表
     * @param {Function} callback 显示回调
     */
    function dir(cmd, entries, callback) {
        // 分析命令参数
        readNormalTree(entries, showNormalTree(cmd, callback));
    }

    /**
     * 展示目录基本结构
     * @param {Object} cmd 命令对象
     * @param {Function} callback core层传入的回调，一般是显示器
     * @return {Function} 闭包
     */
    function showNormalTree(cmd, callback) {
        return function (data) {
            var html = tpl['dir-table']({data: data});
            if (cmd.__arguments__.length > 0) {
                html = tpl['dir-path']({path: '/' + cmd.__path__}) + html;
            }
            callback(html);
        };
    }

    /**
     * 异步读取目录基本结构
     * @param {Array} entries 目录结构数组
     * @param {Function} callback 数据结构回调
     * @param {number} index 开始读取的索引，主要用于自身递归
     * @param {Array} data 已经读取好的属性数组，主要用于自身递归
     */
    function readNormalTree(entries, callback, index, data) {
        if (isNaN(index)) {
            index = 0;
        }
        if (!(data instanceof Array)) {
            data = [];
            data.push({
                name: '.',
                size: 0,
                isDirectory: true,
                time: new Date()
            });
            data.push({
                name: '..',
                size: 0,
                isDirectory: true,
                time: new Date()
            });
        }
        if (index === entries.length && typeof callback === 'function') {
            callback(data);
        }
        else {
            var file = entries[index];
            var info = {
                name: file.name,
                isDirectory: file.isDirectory
            };
            file.getMetadata(function (e) {
                info.size = e.size;
                info.time = e.modificationTime;
                data.push(info);
                readNormalTree(entries, callback, index + 1, data);
            });
        }
    }

    return dir;
});
