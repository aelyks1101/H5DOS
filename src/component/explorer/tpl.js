define(['doT'], function (doT) {
    var ds = ' onselectstart="return false;" data-com="explorer" ';
    var obj = {
        main: [
            '<div class="explorer">',
            '<div class="explorer-header">',
            '<div' + ds + 'data-cmd="prev" title="BackSpace" class="iconfont disable">',
            '&#xe606;</div>',
            '<div' + ds + 'data-cmd="next" title="Alt + Right" class="iconfont disable">',
            '&#xe608;</div>',
            '<div' + ds + 'data-cmd="up" title="Alt + Up" class="iconfont">',
            '&#xe604;</div>',
            '<div' + ds + 'data-cmd="createfolder" title="Alt + N" class="iconfont">',
            '&#xe600;</div>',
            '<input type="text"/>',
            '<div' + ds + 'class="iconfont">&#xe602;</div>',
            '<div' + ds + 'class="iconfont close">&#xe60a;</div>',
            '</div>',
            '<div class="explorer-main">',
            '<div class="explorer-left"></div>',
            '<div class="explorer-right"></div>',
            '</div>',
            '<div class="explorer-foot">',
            '<select></select>',
            'file name:<input type="text"/>',
            '<input type="button" value="OK"/>',
            '<input type="button" value="Cancel"/>',
            '</div>',
            '</div>'
        ],
        creatFolder: [
            '<tr><td>',
            '<div class="iconfont">&#xe605</div>',
            '<input type="text" data-com="explorer" data-cmd="foldername"/>',
            '</td></tr>'
        ]
    };
    for (var key in obj) {
        if (key.indexOf('_') > -1) {
            continue;
        }
        obj[key] = doT.template(obj[key].join(''), undefined);
    }
    return obj;
});
