/**
 * 语言包
 * @param {Object} config 系统配置
 * @return {Object} 语言包
 */
define(['config'], function (config) {
    function language(lng) {
        var obj = {};
        obj.en = {
            'welcome': 'H5DOS v'
                + config.version
                + '<br>&copy 2015 Lhtsoft Corporation.'
                + '<br><br>Please type "help" to see the list of commands. '
                + '<br>View files in your browser: <div class="fs-url">',
            'notCommand': 'is not an internal command or an external command.',
            'target-file-exist': 'The target file already exists, overwrite it?',
            'del-tree': 'Are you sure to delete the directory?',
            'cantOpen': 'can not be opened.',
            'regError': 'Configuration error in registry make the file can not be opened.',
            'uploadExist': 'The following files already exist. Overwrite these files?',
            'downloadError': 'The files do not exist.',
            'help': {
                '_details': 'Use "help command" to check details of the command.',
                'help': {
                    'help': 'View system command list.',
                    'help command': 'Check the command details.'
                },
                'ver': {
                    'ver': 'View system version.'
                },
                'cd': {
                    'cd ..': 'Return to superior directory',
                    'cd directory': 'Change working directory based on current directory.',
                    'cd /directory': 'Change working directory based on root directory.'
                },
                'cls': {
                    'cls': 'Clean the screen.'
                },
                'del': {
                    'del file': 'Delete file in working directory.',
                    'del [/]directory/file': 'Delete file in designated directory.'
                },
                'dir': {
                    'dir': 'View the structure of current working directory.',
                    'dir [/]directory': 'View the structure of designated directory.'
                },
                'md': {
                    'md [/]directory': 'Create an empty directory'
                },
                'edit': {
                    'edit': 'Open simaple text editor.',
                    'edit [[/]directory/]file': 'Edit text file with simaple text editor.'
                },
                'upload': {
                    'upload': 'Upload files from OS to H5DOS.'
                },
                'download': {
                    'download [[/]directory/]file': 'Download file to OS.',
                    'download [[/]directory]': 'Package designated directory, '
                        + 'download zip file to OS.'
                },
                'rd': {
                    'rd [/]directory': 'Remove an empty directory.'
                },
                'deltree': {
                    'deltree [/]directory': 'Remove the entire directory.'
                },
                'time': {
                    'time [format]': 'View system time in specific format.'
                        + '<br>Format: YYYY-MM-DD hh:mm:ss -> 2015.06.12 12:21:23'
                },
                'date': {
                    'date [format]': 'As same as time.'
                },
                'copy': {
                    'copy file|directory directory': 'Copy file or directory to'
                        + ' designated directory.'
                },
                'ren': {
                    'ren file|directory newname': 'Rename file or directory.'
                },
                'move': {
                    'move file|directory directory': 'Move file or directory to'
                        + ' designated directory.'
                },
                'run': {
                    'run [[/]directory/]filename.js': 'Execute a javascript file.'
                }
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
