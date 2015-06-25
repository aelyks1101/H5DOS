define(['doT'], function (doT) {
    var filelist = [
        '<div class="filelist">',
        'filelist',
        '</div>'
    ];
    return doT.template(filelist.join(''), undefined);
});
