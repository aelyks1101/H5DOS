define(['doT'], function (doT) {
    var ds = ' onselectstart="return false;" data-com="explorer" ';
    var favbtn = ' data-com="explorer" data-cmd="removeFavorite"'
        + 'data-path="{{=it.data[n].path}}"';
    var favPath = ' data-com="explorer" data-cmd="openFavorite"'
        + 'data-path="{{=it.data[n].path}}"';
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
            '<div' + ds + 'data-cmd="addFavorite" class="iconfont">&#xe602;</div>',
            '<div' + ds + 'class="iconfont close">&#xe60a;</div>',
            '</div>',
            '<div class="explorer-main">',
            '<div class="explorer-left">',
            '<div class="explorer-favorite"></div>',
            '<div class="explorer-tree"></div>',
            '</div>',
            '<div class="explorer-right"></div>',
            '</div>',
            '<div class="explorer-foot">',
            'file name:<input type="text"/>',
            '<select data-com="explorer" data-cmd="directorFilter"></select>',
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
        ],
        favoriteFolder: [
            '{{if(it.data.length>0){}}',
            '<div class="favorite-box">',
            '{{for(var n=0;n<it.data.length;n++){}}',
            '<div>',
            '<div class="iconfont"' + favbtn + '>&#xe602;</div>',
            '<span' + favPath + '>{{=it.data[n].name}}</span>',
            '</div>',
            '{{}}}',
            '</div>',
            '{{}}}'
        ],
        typeFilter: [
            '{{for(var n=0;n<it.types.length;n++){}}',
            '<option value="{{=it.types[n]}}">*.{{=it.types[n]}}</option>',
            '{{}}}'
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
