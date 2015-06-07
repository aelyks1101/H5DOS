/**
 * H5DOS 内部命令核心
 * 主要负责内部命令解析和系统流程控制
 */
define(
    [
        'config', 'util',
        './language', './template',
        './cmd/dir'
    ], 
    function (config, util, Language, tpl, dir) {
        return {
            // 系统语言包
            _language: Language(config.language),
            // 当前目录
            _path: '',
            // 命令集
            _commands: [],
            // 当前命令指针：-1 最后一条；other 队列中对应
            _cmdIndex: -1,
            // 文件操作句柄
            _fs: null,
            // 系统是否处于询问状态：'':非询问；'Y':肯定；'N':否定；?':等待输入
            _confirm: '',
            /**
             * 错误检测，同时负责错误信息屏显
             * @param {Object} fs回调回传
             * @param {Boolean} dontdisplay 是否不显示
             * @return {Boolean} 是否为错误信息
             */
            _isOK: function (evt, dontdisplay) {
                var isOK = true;
                if (evt instanceof FileError || evt.error) {
                    isOK = false;
                    var msg = evt.message;
                    if (msg.length === 0) {
                        msg = evt.name.charAt(0);
                        for (var n = 1; n < evt.name.length; n++) {
                            if (evt.name.charAt(n) < 'A' || evt.name.charAt(n) > 'Z') {
                                msg += evt.name.charAt(n);
                            }
                            else {
                                msg += ' ' + evt.name.charAt(n);
                            }
                        }
                        msg += '.';
                    }
                    if (!dontdisplay) {
                        util.displayResult(msg);
                    }
                }
                return isOK;
            },
            /**
             * 检测文件是否存在
             * @param {string} path 路径
             * @param {function} is 存在的回调
             * @param {function} not 不存在的回调
             */
            _isFile: function (path, is, not) {
                var me = this;
                function gotEntry (evt) {
                    if (me._isOK(evt, true)) {
                        if (typeof is === 'function') {
                            is(evt);
                        }
                    }
                    else {
                        if (typeof not === 'function') {
                            not(evt);
                        }
                    }
                };
                me._fs.open(path, gotEntry);
            },
            /**
             * 产生callback闭包，封装判断逻辑
             * @param {function} callback 原始函数
             * @return {function} 闭包
             */
            _closeCallback: function (callback) {
                return function (evt) {
                    if (typeof callback === 'function') {
                        callback(evt);
                    }
                };
            },
            /**
             * 复制或移动文件的通用方法
             * 此方法包含了复制或移动文件的通用判断流程
             * @param {Object} cmd 命令对象
             * @param {string} type 通用命令名
             * @param {function} callback 命令执行后的回调
             */
            _copyOrMove: function (cmd, type, callback) {
                var callbackHandler = this._closeCallback(callback);
                if (cmd.__arguments__.length === 0) {
                    callbackHandler({});
                    return;
                }
                var me = this;
                var source = util.joinPath(me._path, cmd.__arguments__[0]);
                var dest = cmd.__arguments__.length > 1
                    ? util.joinPath(me._path, cmd.__arguments__[1]) : me._path;
                if (me._confirm === 'Y') {
                    me._confirm = '';
                    exe();
                }
                else if (me._confirm === 'N') {
                    me._confirm = '';
                    callbackHandler({});
                }
                else {
                    me._isFile(source, isFile ,exe);
                }
                function exe() {
                    me._doubleArguments(source, dest, type, callback);
                }
                function exist() {
                    me._confirm = '?';
                    util.displayConfirm(me._language['targetFileExist']);
                }
                function isFile(fileEntry) {
                    me._isFile(dest + '/' + fileEntry.name, exist, exe);
                }
            },
            /**
             * 执行单一参数的一次性命令
             * md, rd, del
             * @param {Object} cmd 命令对象
             * @param {string} func 通用命令名
             * @param {function} callback 命令执行后的回调
             */
            _singleArgument: function (cmd, func, callback) {
                var callbackHandler = this._closeCallback(callback);
                if (cmd.__arguments__.length === 0 || typeof this._fs[func] !== 'function') {
                    callbackHandler({});
                    return;
                }
                var me = this;
                var path = util.joinPath(me._path, cmd.__arguments__[0]);
                function gotEntry(evt) {
                    if (me._isOK(evt)) {
                        util.displayLocation(me._path);
                    }
                    callbackHandler(evt);
                };
                me._fs[func](path, gotEntry);
            },
            /**
             * 执行二个参数的一次性命令
             * copy, move, ren
             * @param {string} argm1 第一个路径
             * @param {string} argm2 第二个路径
             * @param {string} func 通用命令名
             * @param {function} callback 命令执行后的回调
             */
            _doubleArguments: function (argm1, argm2, func, callback) {
                var callbackHandler = this._closeCallback(callback);
                if (typeof this._fs[func] !== 'function') {
                    callbackHandler({});
                    return;
                }
                var me = this;
                function gotEntry(evt) {
                    if (me._isOK(evt)) {
                        util.displayLocation(me._path);
                    }
                    callbackHandler(evt);
                };
                me._fs[func](argm1, argm2, gotEntry);
            },

            // 以下为对外命令接口
            /**
             * help
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            help: function (cmd, callback) {
                var arr = [];
                var callbackHandler = this._closeCallback(callback);
                for (var key in this) {
                    if (key.indexOf('_') > -1) {
                        continue;
                    }
                    arr.push(key);
                }
                util.displayResult(tpl['help-list']({data: arr}));
                callbackHandler({});
            },
            /**
             * ver
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            ver: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                util.displayResult(config.version);
                callbackHandler({});
            },
            /**
             * time
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            time: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                var t = new Date();
                if (cmd.__arguments__.length > 0) {
                    t = t.format(cmd.__arguments__.join(' '));
                }
                else {
                    t = t.toString();
                }
                util.displayResult(t);
                callbackHandler({});
            },
            /**
             * date
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            date: function (cmd, callback) {
                this.time(cmd, callback);
            },
            /**
             * cls
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            cls: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                util.displayClear();
                callbackHandler({});
            },
            /**
             * md
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            md: function (cmd, callback) {
                this._singleArgument(cmd, 'md', callback);
            },
            /**
             * rd
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            rd: function (cmd, callback) {
                this._singleArgument(cmd, 'rd', callback);
            },
            /**
             * deltree
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            deltree: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                if (this._confirm === 'Y') {
                    this._confirm = '';
                    this._singleArgument(cmd, 'deltree', callback);
                }
                else if (this._confirm === 'N') {
                    this._confirm = '';
                    callbackHandler({});
                }
                else {
                    this._confirm = '?';
                    util.displayConfirm(this._language['deltree']);
                }
            },
            /**
             * dir
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            dir: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                var me = this;
                var path = util.joinPath(
                        me._path,
                        cmd.__arguments__.length > 0 ? cmd.__arguments__[0] : ''
                    );
                function gotEntries(evt) {
                    if (me._isOK(evt)) {
                        cmd.__path__ = path;
                        dir(cmd, evt, util.displayResult);
                    }
                    callbackHandler(evt);
                };
                me._fs.dir(path, gotEntries);
            },
            /**
             * cd
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            cd: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                if (cmd.__arguments__.length === 0) {
                    callbackHandler({});
                    return;
                }
                var me = this;
                var path = util.joinPath(me._path, cmd.__arguments__[0]);
                function gotEntry(evt) {
                    if (me._isOK(evt)) {
                        me._path = path; // 修改当前路径
                        util.displayLocation(path);
                    }
                    callbackHandler(evt);
                };
                me._fs.cd(path, gotEntry);
            },
            /**
             * del
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            del: function (cmd, callback) {
                this._singleArgument(cmd, 'del', callback);
            },
            /**
             * move
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            move: function (cmd, callback) {
                this._copyOrMove(cmd, 'move', callback);
            },
            /**
             * copy
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            copy: function (cmd, callback) {
                this._copyOrMove(cmd, 'copy', callback);
            },
            /**
             * ren
             * @param {Object} cmd 命令对象
             * @param {function} callback 命令执行后的回调
             */
            ren: function (cmd, callback) {
                var callbackHandler = this._closeCallback(callback);
                if (cmd.__arguments__.length < 2) {
                    callbackHandler({});
                    return;
                }
                var me = this;
                var source = util.joinPath(me._path, cmd.__arguments__[0]);
                var dest = cmd.__arguments__[1];
                if (dest.indexOf('/') > -1) {
                    var arr = dest.split('/');
                    dest = arr[arr.length - 1];
                }
                if (typeof dest !== 'string' || dest.length === 0) {
                    callbackHandler({});
                    return;
                }
                if (me._confirm === 'Y') {
                    me._confirm = '';
                    exe();
                }
                else if (me._confirm === 'N' ) {
                    me._confirm = '';
                    callbackHandler({});
                }
                else {
                    me._isFile(source, isFile, exe);
                }
                function gotEntry(evt) {
                    if (me._isOK(evt)) {
                        util.displayLocation(me._path);
                    }
                    callbackHandler(evt);
                }
                function exe() {
                    me._fs.ren(source, dest, gotEntry);
                }
                function exist() {
                    me._confirm = '?';
                    util.displayConfirm(me._language['targetFileExist']);
                }
                function isFile(fileEntry) {
                    if (fileEntry.name === dest) {
                        callbackHandler({});
                    }
                    else {
                        var target = source.split('/');
                        target[target.length - 1] = dest;
                        target = target.join('/');
                        me._isFile(target, exist, exe);
                    }
                }
            }
        };
    }
);