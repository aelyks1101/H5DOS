/**
 * 外部程序调用接口
 */
define(
    [
        'require', 'registry',
        'app/edit/main'
    ],
    function (require, reg) {
        var exp = {};
        for (var key in reg.apps) {
            exp[key] = require('app/' + key + '/main');
        }
        exp['__registry__'] = reg;
        return exp;
    }
);
