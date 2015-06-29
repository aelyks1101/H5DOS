define(
    ['util', './tpl', './ui', './handler'],
    function (util, tpl, ui, handler) {

        // 单例数据
        var exports = {
            _util: util, // 工具集
            _ui: ui, // ui插件
            _fs: null, // 文件句柄
            _callback: null, // 回调函数
            _handler: handler, // 事件句柄
            _dirs: [], // 目录历史队列
            _currentIndex: -1, // 当前目录在历史队列的位置
            _currentList: null, // 当前列表中的数据
            _directoryFilter: '*', // 列表框的滤镜
            _directoryStatus: {}, // 目录打开状态
            _favoriteDirectory: [] // 目录收藏夹
        };

        // 绑定事件上下文
        // 注意，component里所有事件都有外部调用，不绑到DOM上。也就是说只有app才有资格往
        // util.screen上绑代理事件，component里所有事件都有代理根据dataset调用。
        for (var key in handler) {
            if (key.indexOf('_') > -1) {
                continue;
            }
            handler[key] = util.bind(exports, handler[key]);
        }

        // 外部接口
        /**
         * 初始化
         * @param {Object} param 初始化对象
         * @param {Object} param.fs 文件句柄
         * @param {string} param.container 容器筛选仪
         * @param {Function} param.callback 回调函数
         * @param {Object} param.treeStatus 目录打开状态
         * @param {Object} param.favoriteDirectory 目录收藏夹
         */
        exports.initialize = function (param) {
            this._fs = param.fs;
            this._container = param.container;
            this._callback = param.callback;
            this._directoryStatus = param.treeStatus || {};
            this._favoriteDirectory = param.favoriteDirectory || [];
            this._dirs = [];
            this._currentIndex = 0;
            // 初始化插件
            this._ui.tree.initialize('.explorer-tree', uiCallback);
            this._ui.filelist.initialize('.explorer-right', uiCallback);
        };

        /**
         * 显示，导入到screen
         * @param {Object} data 模板渲染数据
         */
        exports.show = function (data) {
            util.screen.append(tpl.main(data))
            readTree(['/'], {}, this._ui.tree.show);
            readDirectory(data.defaultPath || '/', this._ui.filelist.show, true);
            showFavorite();
        };

        /**
         * 跳转到某个目录
         * @param {string} path 目录绝对地址
         */
        exports.readDirectory = function (path, record) {
            readDirectory(path, this._ui.filelist.show, record);
            util.screen.find('.explorer input[type=text]')[1].value = '';
        };

        /**
         * 跳转到上一个历史记录
         */
        exports.previousDirectory = function () {
            this._currentIndex--;
            if (this._currentIndex > -1) {
                readDirectory(this._dirs[this._currentIndex], this._ui.filelist.show);
            }
            else {
                this._currentIndex = 0;
            }
            var btns = util.screen.find('.explorer-header div');
            if (this._currentIndex <= 0) {
                btns.eq(0).addClass('disable');
            }
            if (this._currentIndex < this._dirs.length - 1) {
                btns.eq(1).removeClass('disable');
            }
            util.screen.find('.explorer input[type=text]')[1].value = '';
        };

        /**
         * 回滚到下一个历史记录
         */
        exports.nextDirectory = function () {
            this._currentIndex++;
            if (this._currentIndex < this._dirs.length) {
                readDirectory(this._dirs[this._currentIndex], this._ui.filelist.show);
            }
            else {
                this._currentIndex = this._dirs.length - 1;
            }
            var btns = util.screen.find('.explorer-header div');
            if (this._currentIndex > 0) {
                btns.eq(0).removeClass('disable');
            }
            if (this._currentIndex === this._dirs.length - 1) {
                btns.eq(1).addClass('disable');
            }
            util.screen.find('.explorer input[type=text]')[1].value = '';
        };

        /**
         * 跳到上一层目录
         */
        exports.fatherDirectory = function () {
            if (
                this._dirs.length > 0
                && this._currentIndex < this._dirs.length
                && this._currentIndex > -1
            ) {
                var path = this._dirs[this._currentIndex];
                path = path.split('/');
                path.pop();
                path = path.join('/');
                path = path === '' ? '/' : path;
                if (path !== this._dirs[this._currentIndex]) {
                    readDirectory(path, this._ui.filelist.show, true);
                }
            }
            util.screen.find('.explorer input[type=text]')[1].value = '';
        };

        /**
         * 创建目录
         * @param {Object} evt 事件对象
         */
        exports.createFolder = function (evt) {
            var input = util.screen.find('.explorer-right [data-cmd=foldername]');
            if (evt === 'create' && input.length === 0) {
                util.screen.find('.explorer-right table').append(tpl.creatFolder({}));
                util.screen.find('.explorer-right [data-cmd=foldername]')[0].focus();
            }
            else if (evt.type === 'create' && evt.path.length > 0) {
                if (util.checkFileName(evt.path)) {
                    var path = this._dirs[this._currentIndex] + '/' + evt.path;
                    var same = false;
                    path = path.replace('//', '/');
                    for (var n = 0; n < this._currentList.length; n++) {
                        if (this._currentList[n].fullPath === path) {
                            same = true;
                            break;
                        }
                    }
                    if (!same) {
                        input.removeClass('filename-error');
                        createDirectory(path);
                    }
                    else {
                        input.addClass('filename-error');
                    }
                }
                else {
                    input.addClass('filename-error');
                }
            }
        };

        /**
         * 收藏文件夹
         */
        exports.addFavorite = function () {
            var path = this._dirs[this._currentIndex];
            if (path !== '/' && this._favoriteDirectory.indexOf(path) < 0) {
                this._favoriteDirectory.push(path);
                if (typeof this._callback === 'function') {
                    this._callback({
                        type: 'log',
                        key: 'explorer-favorite-directory',
                        content: this._favoriteDirectory
                    });
                }
                showFavorite();
            }
        };

        /**
         * 删除收藏夹
         * @param {string} path 目录绝对路径
         */
        exports.removeFavorite = function (path) {
            if (path !== '/' && this._favoriteDirectory.indexOf(path) > -1) {
                var arr = [];
                for (var n = 0; n < this._favoriteDirectory.length; n++) {
                    if (path === this._favoriteDirectory[n]) {
                        continue;
                    }
                    arr.push(this._favoriteDirectory[n]);
                }
                this._favoriteDirectory = arr;
                if (typeof this._callback === 'function') {
                    this._callback({
                        type: 'log',
                        key: 'explorer-favorite-directory',
                        content: this._favoriteDirectory
                    });
                }
                showFavorite();
            }
        };

        /**
         * 卸载
         */
        exports.dispose = function () {
            this._fs = null;
            this._container = null;
            this._callback = null;
            this._dirs = [];
            this._currentIndex = 0;
        };

        // 内部方法
        /**
         * ui回调
         * @param {Object} evt 事件对象
         */
        function uiCallback(evt) {
            if (evt.type === 'tree-file') {
                var path = ('/' + util.getFilePath(evt.path)).replace('//', '/');
                readDirectory(path, exports._ui.filelist.show, true);
                util.screen.find('.explorer input[type=text]')[1].value = evt.path;
            }
            else if (evt.type === 'tree-folder') {
                readDirectory(evt.path, exports._ui.filelist.show, true);
                util.screen.find('.explorer input[type=text]')[1].value = '';
            }
            else if (evt.type === 'tree-toggle') {
                if (evt.show) {
                    exports._directoryStatus[evt.path] = true;
                }
                else if (exports._directoryStatus[evt.path]) {
                    delete exports._directoryStatus[evt.path];
                }
                if (typeof exports._callback === 'function') {
                    exports._callback({
                        type: 'log',
                        key: 'explorer-tree-status',
                        content: exports._directoryStatus
                    });
                }
            }
        }

        /**
         * 显示收藏夹
         */
        function showFavorite() {
            var arr = [];
            for (var n = 0; n < exports._favoriteDirectory.length; n++) {
                var tmp = exports._favoriteDirectory[n].split('/');
                arr.push({
                    isDirectory: true,
                    path: exports._favoriteDirectory[n],
                    name: tmp[tmp.length - 1]
                });
            }
            var html = tpl.favoriteFolder({data: arr.sort(util.fileSortByChar)});
            util.screen.find('.explorer .explorer-favorite').html(html);
        }

        /**
         * 创建新目录
         * @param {string} path 目录绝对路径
         */
        function createDirectory(path) {
            exports._fs.md(path, function (evt) {
                if (evt.error) {
                    alert(evt.message);
                }
                else {
                    readTree(['/'], {}, exports._ui.tree.show);
                    readDirectory(
                        exports._dirs[exports._currentIndex],
                        exports._ui.filelist.show
                    );
                }
            });
        }

        /**
         * 保存历史目录
         * @param {string} path 目录地址
         */
        function recordDirectory(path) {
            while (
                exports._currentIndex < exports._dirs.length - 1
                && exports._dirs.length > 0
            ) {
                exports._dirs.pop();
            }
            var lastpath = exports._dirs.length === 0
                ? '//' : exports._dirs[exports._dirs.length - 1];
            if (lastpath !== path) {
                exports._dirs.push(path);
                exports._currentIndex = exports._dirs.length - 1;
                var btns = util.screen.find('.explorer-header div');
                if (exports._currentIndex > 0) {
                    btns.eq(0).removeClass('disable');
                }
                else {
                    btns.eq(0).addClass('disable');
                }
                btns.eq(1).addClass('disable');
            }
        }

        /**
         * 读取目录信息
         * @param {string} path 目录地址
         * @param {Function} callback 回调函数
         * @param {boolean} record 是否记入历史访问
         */
        function readDirectory(path, callback, record) {
            var arr = [];
            var types = ['*'];
            exports._fs.dir(path, function (evt) {
                if (!evt.error) {
                    arr = evt.sort(util.fileSortByChar);
                    if (record) {
                        recordDirectory(path);
                    }
                    readMetadata(0);
                }
            });
            function readMetadata(n) {
                if (n === arr.length) {
                    exports._currentList = arr;
                    util.screen.find('.explorer input[type=text]')[0].value = path;
                    var select = util.screen.find('.explorer select');
                    select.html(tpl.typeFilter({types: types}))
                        .val(exports._directoryFilter);
                    exports._directoryFilter = select[0].value;
                    callback({data: arr, filter: exports._directoryFilter});
                }
                else {
                    var info = {
                        fullPath: arr[n].fullPath,
                        isDirectory: arr[n].isDirectory,
                        isFile: arr[n].isFile,
                        name: arr[n].name,
                        type: arr[n].isFile ? util.getFileType(arr[n].name) : ''
                    };
                    if (types.indexOf(info.type) < 0 && info.type !== '') {
                        types.push(info.type);
                    }
                    arr[n].getMetadata(function (e) {
                        info.size = util.getFileSize(e.size);
                        info.time = e.modificationTime;
                        arr[n] = info;
                        readMetadata(n + 1);
                    });
                }
            }
        }

        /**
         * 读取文件树，生成数据结构
         * @param {Array} works 工作队列
         * @param {Object} tree 数据结构
         * @param {Function} callback 回调函数
         */
        function readTree(works, tree, callback) {
            var key = '';
            if (works.length === 0) {
                // 递归出口
                callback({
                    tree: tree,
                    status: exports._directoryStatus
                });
            }
            else {
                // 写入目录
                key = works[0];
                var arr = key.split('/');
                tree[key] = {
                    fullPath: key,
                    isDirectory: true,
                    isFile: false,
                    name: arr[arr.length - 1].length ? arr[arr.length - 1] : '',
                    children: []
                };
                // 读取内容
                exports._fs.dir(key, function (evt) {
                    evt.sort(util.fileSortByChar);
                    for (var n = 0; n < evt.length; n++) {
                        var path = evt[n].fullPath;
                        // 注册关联
                        tree[key].children.push(path);
                        if (evt[n].isDirectory) {
                            works.push(path);
                            continue;
                        }
                        // 写入文件
                        tree[path] = {
                            fullPath: path,
                            isDirectory: false,
                            isFile: true,
                            name: evt[n].name
                        };
                    }
                    // 递归
                    works.shift();
                    readTree(works, tree, callback);
                });
            }
        }

        // 返回实例
        return exports;
    }
);
