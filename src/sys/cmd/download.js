/**
 * 命令解析器封包
 * @param {Function} Zip zip打包工具
 * @param {Function} saver 下载推送工具
 * @return {Object} download接口
 */
define(['zip', 'saver'], function (Zip, saver) {

    var fs = null;          // 文件系统
    var callback = null;    // 回调
    var jobs = [];          // 封包工作队列

    /**
     * 对外接口
     * @param {string} path 输入的路径
     * @param {Object} core 系统核心
     * @param {Function} func 执行完毕后的回调
     */
    function gotPath(path, core, func) {
        fs = core._fs;
        callback = func;
        jobs = [path] || function () {};
        expand(0, pack);
    }

    /**
     * 工作队列打包
     * @param {number} index 当前打包索引
     * @param {Object} pck 正在操作的打包
     */
    function pack(index, pck) {
        var boot = '';
        var job = null;
        callback({
            current: index,
            total: jobs.length
        });
        if (jobs[0] == null) {
            callback({
                error: true,
                message: 'downloadError'
            });
        }
        else if (jobs.length === 1 && jobs[0].isFile) {
            fs.read(jobs[0].fullPath, {type: 'readAsBinaryString'}, singleFile);
        }
        else if (index >= jobs.length) {
            var filename = '';
            if (jobs[0] === '') {
                filename = 'root';
            }
            else {
                filename = jobs[0].replace(/\/g/, '-');
            }
            saver(pck.generate({type: 'blob'}), filename + '.zip');
            callback({
                current: jobs.length + 1,
                total: jobs.length
            });
        }
        else {
            boot = jobs[0];
            job = jobs[index];
            if (typeof job === 'string') {
                pack(index + 1, pck);
            }
            else if (job.isDirectory) {
                var path = job.fullPath.substr(1, job.fullPath.length);
                if (boot !== '') {
                    path = path.replace(boot + '/', '');
                }
                pck.folder(path);
                pack(index + 1, pck);
            }
            else if (job.isFile) {
                fs.read(job.fullPath, {type: 'readAsBinaryString'}, gotFile);
            }
        }
        function singleFile(evt) {
            pck.file(jobs[0].name, evt.target.result, {binary: true});
            saver(pck.generate({type: 'blob'}), jobs[0].name + '.zip');
        }
        function gotFile(evt) {
            var path = job.fullPath.substr(1, job.fullPath.length);
            if (boot !== '') {
                path = path.replace(boot + '/', '');
            }
            pck.file(path, evt.target.result, {binary: true});
            pack(index + 1, pck);
        }
    }

    /**
     * 展开工作队列
     * @param {number} index 当前展开所用
     * @param {Function} func 展开结束后的回调
     */
    function expand(index, func) {
        if (index >= jobs.length) {
            func(0, new Zip());
        }
        else if (typeof jobs[index] === 'string') {
            fs.dir(jobs[index], isDir);
        }
        else {
            if (jobs[index].isFile) {
                expand(index + 1, func);
            }
            else {
                fs.dir(jobs[index].fullPath, isDir);
            }
        }
        function isFile(result) {
            if (result.error) {
                jobs[index] = null;
            }
            else {
                jobs[index] = result;
            }
            expand(index + 1, func);
        }
        function isDir(result) {
            if (result.error) {
                fs.open(jobs[index], isFile);
            }
            else {
                for (var n = 0; n < result.length; n++) {
                    jobs.push(result[n]);
                }
                expand(index + 1, func);
            }
        }
    }

    return gotPath;
});
