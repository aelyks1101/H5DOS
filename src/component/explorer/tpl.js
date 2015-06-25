define(['doT'], function (doT) {
    var explorer = [
        '<div class="explorer">',
        '<div class="explorer-header">',
        '<div onselectstart="return false;" class="iconfont">&#xe606;</div>',
        '<div onselectstart="return false;" class="iconfont">&#xe608;</div>',
        '<div onselectstart="return false;" class="iconfont">&#xe604;</div>',
        '<div onselectstart="return false;" class="iconfont">&#xe600;</div>',
        '<input type="text"/>',
        '<div onselectstart="return false;" class="iconfont">&#xe602;</div>',
        '<div onselectstart="return false;" class="iconfont close">&#xe60a;</div>',
        '</div>',
        '<div class="explorer-main">',
        '<div class="explorer-left"></div>',
        '<div class="explorer-right">{{=it.filelist}}</div>',
        '</div>',
        '<div class="explorer-foot">',
        '<select></select>',
        'file name:<input type="text"/>',
        '<input type="button" value="OK"/>',
        '<input type="button" value="Cancel"/>',
        '</div>',
        '</div>'
    ];
    return doT.template(explorer.join(''), undefined);
});
