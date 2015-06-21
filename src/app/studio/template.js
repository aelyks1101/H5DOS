define(['component', 'doT'], function (cmpt, doT) {
    var obj = {
        'main': [
            '<div class="info-bar"></div>',
            '<div class="folder-bar"></div>',
            '<div class="tab-bar"></div>',
            '<div class="editor-box">',
            '<div class="editor"></div>',
            '</div>',
            cmpt.menu
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
