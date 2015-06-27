define(['doT'], function (doT) {
    var fileBtn = 'data-com="tree" data-cmd="file" data-path="{{=it.fullPath}}"';
    var folderBtn = 'data-com="tree" data-cmd="folder" data-path="{{=it.fullPath}}"';
    var toggleBtn = 'data-com="tree" data-cmd="toggle" data-path="{{=it.fullPath}}"';
    var obj = {
        'file': [
            '<div class="label" ' + fileBtn + '>',
            '<div class="iconfont" ' + fileBtn + '>&#xe601;</div>',
            '{{=it.name}}',
            '</div>'
        ],
        'directory': [
            '<div class="folder {{=(it.open?"":"hideChildren")}}">',
            '<div class="iconfont" ' + toggleBtn + '>',
            '{{=(it.open?"&#xe607;":"&#xe605;")}}</div>',
            '<span class="label" ' + folderBtn + '>{{=it.name}}</span>',
            '{{if(it.children.length>0){}}',
            '<div class="children">',
            '{{for(var n=0;n<it.children.length;n++){}}',
            '{{=it.children[n].html}}',
            '{{}}}',
            '</div>',
            '{{}}}',
            '</div>'
        ],
        'tree': [
            '<div class="tree" onselectstart="return false">',
            '{{if(it.children.length>0){}}',
            '{{for(var n=0;n<it.children.length;n++){}}',
            '{{=it.children[n].html}}',
            '{{}}}',
            '{{}}}',
            '</div>'
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
