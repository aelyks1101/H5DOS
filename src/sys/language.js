/**
 * 语言包
 */
define(['config'], function (config) {

    function Language(lng) {
        var obj = {
            en: {
                welcome: 'H5DOS v' + config.version + '<br>&copy 2015 Lhtsoft Corporation.'
                    + '<br><br>Please type "help" to see the list of commands, '
                    + 'or view files in your browser:<br><div class="fs-url">',
                notCommand: 'is not an internal command or an external command.',
                targetFileExist: 'The target file already exists, overwrite it?',
                deltree: 'Are you sure to delete the directory?'
            }
        };
        if (obj[lng]) {
            return obj[lng];
        }
        else {
            return obj.en;
        }
    }
    
    return Language(config.language);

});
