define(['util'], function (util) {
    /**
     * 功能函数集，目的是为了让main.js体积变小
     * 本模块中所有方法上下文均被绑定到studio的app对象。
     */
    return {
        /**
         * 打开文件选择对话框
         * @param {Object} language 语言包
         */
        openfile: function (language) {
            this.cmd = 'openfile';
            this.ui.explorer.show({
                type: 'open',
                defaultPath: this.path,
                language: language
            });
        },
        /**
         * 显示数据结构中的代码
         * @param {string} key 代码索引
         * @param {Object} app studio数据单例
         */
        displayCode: function (key) {
            var f = this.codes[key];
            if (f) {
                this.ui.editor.code(f.code);
            }
        },
        /**
         * 读取文件，载入代码，显示代码
         * @param {string} path 文件绝对路径
         */
        loadCode: function (path) {
            if (this.codes[path]) {
                this.ui.editor.code(this.codes[path].code);
            }
            else {
                var me = this;
                me.fs.read(path, {}, function (evt) {
                    if (!evt.error) {
                        var file = {
                            code: evt.target.result,
                            type: util.getFileType(path),
                            name: util.getFileName(path),
                            path: util.getFilePath(path),
                            save: false
                        };
                        me.codes[path] = file;
                        me.ui.editor.code(file.code);
                    }
                });
            }
        }
    };
});
