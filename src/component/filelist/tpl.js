define(['doT', './language'], function (doT, lng) {
    var btn = 'data-com="filelist"'
        + ' data-cmd="{{=it.data[n].isFile?"file":"folder"}}"'
        + ' data-path="{{=it.data[n].fullPath}}"';
    var main = [
        '<table class="filelist"',
        ' cellspacing="0" cellpadding="0" onselectstart="return false">',
        '<tr>',
        '<th class="namefield">' + lng.name + '</th>',
        '<th class="datefield">' + lng.date + '</th>',
        '<th class="typefield">' + lng.type + '</th>',
        '<th class="sizefield">' + lng.size + '</th>',
        '</tr>',
        '{{if(it.data.length){}}',
        '{{for(var n=0;n<it.data.length;n++){}}',
        '{{if(it.data[n].isFile&&!it.showfile){}}',
        '{{continue;}}}',
        '{{if(it.data[n].type!==""&&it.data[n].type!==it.filter&&it.filter!=="*"){}}',
        '{{continue;}}}',
        '<tr>',
        '<td ' + btn + '>',
        '<div class="iconfont" ' + btn + '>',
        '{{=it.data[n].isFile?"&#xe601;":"&#xe605;"}}',
        '</div>',
        '{{=it.data[n].name}}</td>',
        '<td ' + btn + '>{{=it.data[n].time.format("YYYY/MM/DD hh:mm")}}</td>',
        '<td ' + btn + '>{{=it.data[n].type}}</td>',
        '<td ' + btn + '>{{=it.data[n].isFile?it.data[n].size:""}}</td>',
        '</tr>',
        '{{}}}',
        '{{}}}',
        '</table>'
    ];
    return doT.template(main.join(''), undefined);
});
