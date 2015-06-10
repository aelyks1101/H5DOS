/**
 * 语言包
 * @param {Object} config 系统配置
 * @return {Object} 语言包
 */
define(['config'], function (config) {

    function language(lng) {
        var obj = {
            en: {
                welcome: 'H5DOS v' + config.version + '<br>&copy 2015 Lhtsoft Corporation.'
                    + '<br><br>Please type "help" to see the list of commands, '
                    + 'or view files in your browser:<br><div class="fs-url">',
                notCommand: 'is not an internal command or an external command.',
                'target-file-exist': 'The target file already exists, overwrite it?',
                'del-tree': 'Are you sure to delete the directory?',
                cantOpen: 'can not be opened.',
                regError: 'Configuration error in registry make the file can not be opened.'
            }
        };
        var r = {};
        if (obj[lng]) {
            r = obj[lng];
        }
        else {
            r = obj.en;
        }
        return r;
    }

    return language(config.language);

});
