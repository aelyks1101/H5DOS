define(['doT'], function (doT) {
    var obj = {
        'main': [
            '<div class="info-bar"></div>',
            '<div class="folder-bar"></div>',
            '<div class="tab-bar"></div>',
            '<div class="editor"></div>',
            '<div class="menu"></div>'
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
