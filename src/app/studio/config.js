define(['./language'], function (lng) {
    return {
        language: lng,
        menu: [
            {
                label: lng.menu.file,
                cmd: 'file',
                items: [
                    {
                        label: lng.menu.newFile,
                        hotkey: 'Alt + N',
                        cmd: 'newfile'
                    },
                    {
                        label: lng.menu.openFile,
                        hotkey: 'Alt + O',
                        cmd: 'openfile'
                    }
                ]
            }
        ]
    };
});
