/**
 * 外部程序调用接口
 */
define(
    [
        'require', 'registry',
        'app/edit/main',
        'app/bat/main'
    ],
    function (require, reg) {
        var exp = {};
        for (var key in reg.apps) {
            if (key.indexOf('_') > -1) {
                continue;
            }
            exp[key] = require('app/' + key + '/main');
        }
        exp.__registry__ = reg;
        return exp;
    }
);
