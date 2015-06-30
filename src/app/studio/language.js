define(['config'], function (config) {
    function language(lng) {
        var obj = {
            en: {
                menu: {
                    file: 'File',
                    newFile: 'New File',
                    openFile: 'Open File',
                    edit: 'Edit'
                },
                explorer: {
                    select: 'Select',
                    save: 'Save',
                    open: 'Open',
                    cancel: 'Cancel',
                    filename: {
                        save: 'File',
                        open: 'File',
                        select: 'Folder'
                    }
                }
            }
        };
        var rlng = {};
        if (obj[lng]) {
            rlng = obj[lng];
        }
        else {
            rlng = obj.en;
        }
        return rlng;
    }
    return language(config.language);
});
