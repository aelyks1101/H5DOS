/**
 * help命令执行单元
 * @param {Object} reg 注册表
 * @return {Function} help命令解析器
 */
define(['registry'], function (reg) {

    return function (core, cmd) {
        var data = {
            tplname: '',
            content: {
                title: '',
                data: []
            }
        };
        var help = core._language.help;
        var key = cmd.__arguments__.length > 0 ? cmd.__arguments__[0] : '';
        if (key !== '' && key.indexOf('_') < 0 && help[key]) {
            data.tplname = 'help-detial';
            data.content.title = key;
            for (var example in help[key]) {
                if (example.indexOf('_') > -1) {
                    continue;
                }
                data.content.data.push({
                    'example': example,
                    'detial': help[key][example]
                });
            }
        }
        else {
            data.tplname = 'help-list';
            data.content.title = help._details;
            for (var n in core) {
                if (n.indexOf('_') > -1) {
                    continue;
                }
                data.content.data.push(n);
            }
            for (var app in reg.apps) {
                if (reg.apps[app].visible === false) {
                    continue;
                }
                data.content.data.push(app);
            }
        }
        return data;
    };
});
