define(['config'], function (config) {
    function language(lng) {
        var obj = {
            en: {
                menu: [
                    {
                        label: 'File',
                        cmd: 'm1',
                        items: [
                            {
                                label: 'New File',
                                hotkey: 'Alt + N',
                                checked: true,
                                cmd: 'm11'
                            },
                            {
                                cutline: true
                            },
                            {
                                label: 'Open File',
                                checked: false,
                                disable: true,
                                cmd: 'm12',
                                items: [
                                    {label: 'file1.js', cmd: 'm121', disable: true},
                                    {label: 'file1.js', cmd: 'm122'},
                                    {label: 'file1.js', cmd: 'm123'},
                                    {label: 'file1.js', cmd: 'm124'},
                                    {label: 'file1.js', cmd: 'm125'},
                                    {label: 'file1.js', cmd: 'm126'}
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Edit',
                        cmd: 'm2',
                        items: [
                            {
                                label: 'Edit File',
                                hotkey: 'ctrl + e',
                                checked: false,
                                cmd: 'm21'
                            },
                            {
                                label: 'write File',
                                checked: true,
                                cmd: 'm22',
                                items: [
                                    {label: 'file21.js', cmd: 'm221', disable: true},
                                    {label: 'file21.js', cmd: 'm222'},
                                    {label: 'file21.js', cmd: 'm223'},
                                    {
                                        cutline: true
                                    },
                                    {label: 'file21.js', cmd: 'm224'},
                                    {label: 'file21.js', cmd: 'm225'},
                                    {label: 'file21.js', cmd: 'm226'}
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Find',
                        cmd: 'm3',
                        disable: true
                    }
                ]
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
