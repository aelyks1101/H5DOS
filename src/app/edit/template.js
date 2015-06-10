define(['doT'], function (doT) {

    var obj = {
        'main': [
            '<textarea class="content" spellcheck="false"></textarea>',
            '<div class="menu">',
            '<div class="menu-button" data-cmd="new" title="Ctrl + N">{{=it.newfile}}</div>',
            '<div class="menu-button" data-cmd="save" title="Ctrl + S">{{=it.save}}</div>',
            '<div class="menu-button" data-cmd="quit" title="Alt + Q">{{=it.quit}}</div>',
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
