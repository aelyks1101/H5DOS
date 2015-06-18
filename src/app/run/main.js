/**
 * 运行js脚本主接口
 */
define(
    ['util', './sandbox', './language'],
    function (util, sandbox, language) {
        // 装载沙箱
        window.sandbox = sandbox;
        document.body.appendChild(sandbox.iframe);
        /**
         * 初始化
         * @param {string} path 当前操作目录
         * @param {string} file 操作文件名
         * @param {Object} fs 文件系统句柄
         */
        function initialize(path, file, fs) {
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
                        sandbox.run(evt.target.result, output);
                    }
                });
            }
        }
        /**
         * 沙箱输出
         */
        function output(param) {
            var str = '';
            if (param.error) {
                str = param.target.message;
            }
            else {
                str = param.arguments.join(' ');
            }
            util.displayResult(str);
        }

        return initialize;
    }
);
