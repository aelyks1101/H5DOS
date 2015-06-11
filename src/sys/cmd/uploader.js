/**
 * UPLOAD命令执行单元
 * @param {Object} require require方法
 * @return {Function} upload命令解析器
 */
define(function (require) {

    var files = null;       // 传入的文件列表
    var util = null;        // 传入的工具集
    var fs = null;          // 传入的文件操作句柄
    var path = null;        // 传入的当前路径
    var language = null;    // 传入的语言包
    var finished = null;    // 传入的上传完毕回调函数

    /**
     * 接口
     * @param {Array} _files 文件句柄，由input(type=file)选择
     * @param {Object} _util 工具集
     * @param {Object} _core 系统核心
     * @param {Function} _callback 上传结束后的回调
     */
    function gotFiles(_files, _util, _core, _callback) {
        files = _files;
        util = _util;
        fs = _core._fs;
        path = _core._path;
        finished = _callback;
        language = _core._language;
        check(0, confirm);
    }

    /**
     * 检查冲突
     * @param {number} index 当前检查的文件
     * @param {Function} callback 全部检查完毕后的回调
     */
    function check(index, callback) {
        if (index >= files.length) {
            callback();
        }
        else {
            files[index]._realPath = util.joinPath(path, files[index].name);
            fs.open(
                files[index]._realPath,
                function (evt) {
                    if (!evt.error) {
                        files[index]._exist = true;
                    }
                    check(index + 1, callback);
                }
            );
        }
    }

    /**
     * 确认冲突
     */
    function confirm() {
        var exits = '';
        for (var n = 0; n < files.length; n++) {
            if (files[n]._exist) {
                exits += files[n].name + ',';
            }
        }
        if (exits.length > 0) {
            exits = exits.substr(0, exits.length - 1);
        }
        var overwrite = false;
        if (exits.length > 0) {
            overwrite = window.confirm(language.uploadExist + '\n' + exits);
        }
        upload(0, overwrite, {
            success: [],
            fail: []
        });
    }

    /**
     * 上传
     * @param {number} index 上传的文件索引
     * @param {boolean} overwrite 是否覆盖同名
     * @param {Object} result 上传结果对象
     */
    function upload(index, overwrite, result) {
        if (index >= files.length) {
            finished(result);
        }
        else {
            if (files[index]._exist && !overwrite) {
                upload(index + 1, overwrite);
            }
            else {
                if (files[index]._exist) {
                    fs.open(files[index]._realPath, gotEntry);
                }
                else {
                    fs.create(files[index]._realPath, gotEntry);
                }
            }
        }
        function gotWriter(writer) {
            writer.onwriteend = function(e) {
                result.success.push(files[index].name);
                upload(index + 1, overwrite, result);
            };
            writer.onerror = function(e) {
                result.fail.push(files[index].name);
                upload(index + 1, overwrite, result);
            };
            writer.write(files[index]);
        }
        function gotEntry(entry) {
            if (entry.error) {
                finished({error: true});
            }
            else {
                entry.createWriter(gotWriter);
            }
        }
    }

    return gotFiles;
});
