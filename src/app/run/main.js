/**
 * 运行js脚本主接口
 */
define(
    ['util', './sandbox', './language'],
    function (util, sandbox, language) {

        var currentFile = '';

        // 装载沙箱
        sandbox.setup(util);

        /**
         * 读取文件并执行
         * @param {string} path 当前操作目录，本应用中没用
         * @param {string} file 操作文件名
         * @param {Object} fs 文件系统句柄
         */
        function read(path, file, fs) {
            if (
                typeof file !== 'string'
                || file.length === 0
                || util.getFileType(file) !== 'js'
            ) {
                util.displayResult(language.nofile);
            }
            else {
                fs.read(file, {}, function (evt) {
                    if (evt.error) {
                        util.displayResult(evt.message);
                    }
                    else {
                        var sources = {};
                        currentFile = file;
                        sources[file] = true;
                        path = util.getFilePath(file);
                        merge(evt.target.result, sources, path, fs, merged);
                    }
                });
            }
        }

        /**
         * 代码合并后的回调
         * @param {string} code 源代码文本
         */
        function merged(code) {
            sandbox.run(code, output);
        }

        /**
         * 合并include进来的js文件
         * @param {string} code 源代码
         * @param {Object} source 已经合并过的绝对路径对象
         * @param {string} path 打开的js文件所在目录
         * @param {Object} fs 文件系统
         * @param {Function} callback 合并结束后执行的回调
         */
         // 源文件中如果注释写成，则表示引入filename文件 /*include filename*/
        function merge(code, source, path, fs, callback) {
            var index = code.indexOf('/*include ');
            if (index > -1) {
                var fileName = findFileName(code, index);
                var absFileName = util.joinPath(path, fileName);
                if (source[absFileName]) {
                    code = code.replace('/*include ' + fileName + '*/', '');
                    merge(code, source, path, fs, callback);
                }
                else {
                    fs.read(absFileName, {}, function (evt) {
                        var str = '';
                        if (evt.error) {
                            str = '';
                        }
                        else {
                            str = evt.target.result;
                        }
                        code = code.replace('/*include ' + fileName + '*/', str);
                        source[absFileName] = true;
                        merge(code, source, path, fs, callback);
                    });
                }
            }
            else {
                callback(code);
            }
        }

        /**
         * 寻找include的文件名
         * @param {string} code 源代码
         * @param {number} index 开始搜索位置
         * @return {string} 文件名
         */
        function findFileName(code, index) {
            var pos = -1;
            var filename = '';
            for (var n = index; n < code.length - 1; n++) {
                if (code.charAt(n) === '*' && code.charAt(n + 1) === '/') {
                    pos = n + 1;
                    break;
                }
            }
            if (pos > 0) {
                filename = code.substr(index, pos - index + 1)
                    .replace('/*include ', '')
                    .replace('*/', '');
            }
            return filename;
        }

        /**
         * 沙箱输出
         * @param {Object} param 沙箱的输出对象
         */
        function output(param) {
            var str = '';
            if (param.openscreen === true) {
                sandbox.visible(true, currentFile);
            }
            else if (param.openscreen === false) {
                sandbox.visible(false);
            }
            else if (param.error) {
                str = param.target.message;
            }
            else {
                str = param.arguments.join(' ');
            }
            util.displayResult(str);
        }

        return read;
    }
);
