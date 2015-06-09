define(['config'], function (config) {
    function Language(lng) {
        var obj = {
            en: {
                newfile: 'New',
                save: 'Save',
                quit: 'Quit',
                discardchange: 'Do you want to save the file?',
                unsaved: 'Are you sure to quit without saving the file?',
                noname: 'Please input file name.',
                fileexist: ' does exist, overwrite it?',
                unablename: 'These chars can not be used in file name:\n' +
                    '          \\/:*?" <>\'',
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
