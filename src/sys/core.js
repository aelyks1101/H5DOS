/**
 * H5DOS 内部命令核心
 * 主要负责内部命令解析和系统流程控制
 */
define(
    ['util', 'registry', './execute', './language', './template', './cmd/main'],
    function (util, reg, exe, language, tpl, cmdHandler) {
        return {
            // 系统语言包
            _language: language,
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
             * help
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            help: function (cmd, callback) {
                var arr = [];
                var callbackHandler = exe.closeCallback(callback);
                for (var key in this) {
                    if (key.indexOf('_') > -1) {
                        continue;
                    }
                    arr.push(key);
                }
                for (var app in reg.apps) {
                    if (reg.apps[app].visible === false) {
                        continue;
                    }
                    arr.push(app);
                }
                util.displayResult(tpl['help-list']({data: arr}));
                callbackHandler({});
            },
            /**
             * ver
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            ver: function (cmd, callback) {
                var callbackHandler = exe.closeCallback(callback);
                util.displayResult(util.config.version);
                callbackHandler({});
            },
            /**
             * time
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            time: function (cmd, callback) {
                var callbackHandler = exe.closeCallback(callback);
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
             * @param {Function} callback 命令执行后的回调
             */
            date: function (cmd, callback) {
                this.time(cmd, callback);
            },
            /**
             * cls
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            cls: function (cmd, callback) {
                var callbackHandler = exe.closeCallback(callback);
                util.displayClear();
                callbackHandler({});
            },
            /**
             * md
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            md: function (cmd, callback) {
                exe.singleArgument(this, cmd, 'md', callback);
            },
            /**
             * rd
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            rd: function (cmd, callback) {
                exe.singleArgument(this, cmd, 'rd', callback);
            },
            /**
             * deltree
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            deltree: function (cmd, callback) {
                var callbackHandler = exe.closeCallback(callback);
                if (this._confirm === 'Y') {
                    this._confirm = '';
                    exe.singleArgument(this, cmd, 'deltree', callback);
                }
                else if (this._confirm === 'N') {
                    this._confirm = '';
                    callbackHandler({});
                }
                else {
                    this._confirm = '?';
                    util.displayConfirm(this._language['del-tree']);
                }
            },
            /**
             * dir
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            dir: function (cmd, callback) {
                var callbackHandler = exe.closeCallback(callback);
                var me = this;
                var url = cmd.__arguments__.length > 0 ? cmd.__arguments__[0] : '';
                var path = util.joinPath(me._path, url);
                me._fs.dir(path, gotEntries);
                function gotEntries(evt) {
                    if (exe.isOK(evt)) {
                        cmd.__path__ = path;
                        cmdHandler.dir(cmd, evt, util.displayResult);
                    }
                    callbackHandler(evt);
                }
            },
            /**
             * cd
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            cd: function (cmd, callback) {
                var callbackHandler = exe.closeCallback(callback);
                if (cmd.__arguments__.length === 0) {
                    callbackHandler({});
                    return;
                }
                var me = this;
                var path = util.joinPath(me._path, cmd.__arguments__[0]);
                me._fs.cd(path, gotEntry);
                function gotEntry(evt) {
                    if (exe.isOK(evt)) {
                        me._path = path;
                        util.displayLocation(path);
                    }
                    callbackHandler(evt);
                }
            },
            /**
             * del
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            del: function (cmd, callback) {
                exe.singleArgument(this, cmd, 'del', callback);
            },
            /**
             * move
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            move: function (cmd, callback) {
                cmdHandler.move(exe, util, this, cmd, callback);
            },
            /**
             * copy
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            copy: function (cmd, callback) {
                cmdHandler.copy(exe, util, this, cmd, callback);
            },
            /**
             * ren
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            ren: function (cmd, callback) {
                cmdHandler.ren(exe, util, this, cmd, callback);
            },
            /**
             * upload
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            upload: function (cmd, callback) {
                var me = this;
                util.upload.onchange = function (evt) {
                    util.upload.onchange = null;
                    cmdHandler.upload(evt.target.files, util, me, finished);
                    function finished(result) {
                        evt.target.value = '';
                        util.displayResult(tpl['upload-result'](result));
                    }
                };
                util.upload.click();
            },
            /**
             * download
             * @param {Object} cmd 命令对象
             * @param {Function} callback 命令执行后的回调
             */
            download: function (cmd, callback) {
                var url = cmd.__arguments__.length > 0 ? cmd.__arguments__[0] : '';
                var path = util.joinPath(this._path, url);
                cmdHandler.download(path, this, progress);
                function progress(obj) {
                    if (obj.error) {
                        util.displayResult(language[obj.message]);
                    }
                    else if (obj.current > obj.total) {
                        util.displayCommand('');
                    }
                    else {
                        util.displayCommand(obj.current + '/' + obj.total);
                    }
                }
            }
        };
    }
);
