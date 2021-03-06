/**
 * 模板引擎
 * @param {Object} doT 模板解析引擎
 * @return {Object} 模板对象
 */
define(['doT'], function (doT) {

    var obj = {
        'upload-result': [
            '{{if(it.error){}}',
            '<div>File System Crashed!</div>',
            '{{}else{}}',
            '<div>Success: {{=it.success.length}}; Fail: {{=it.fail.length}}</div>',
            '{{}}}'
        ],
        'dir-path': [
            '<div>{{=it.path}}</div>'
        ],
        'dir-table': [
            '<table class="dir-table">',
            '{{for(var n=0; n<it.data.length; n++){}}',
            '<tr><td>',
            '{{=it.data[n].time.format("YYYY/MM/DD")+" "+it.data[n].time.format("hh:mm")}}',
            '</td><td class="dir-type">',
            '{{=(it.data[n].isDirectory?"&lt;DIR&gt;":"")}}',
            '</td><td class="dir-size">',
            '{{=it.data[n].size}}',
            '</td><td>',
            '{{=it.data[n].name}}',
            '</td></tr>',
            '{{}}}',
            '</table>'
        ],
        'help-list': [
            '<div class="fs-url">{{=it.title}}</div>',
            '<table class="help-list">',
            '{{for(var n=0;n<it.data.length;n++){}}',
            '{{if (n % 5 ===0) {}}',
            '<tr>',
            '{{}}}',
            '<td>{{=it.data[n]}}</td>',
            '{{if(n % 5 === 4 || n === it.data.length-1){}}',
            '</tr>',
            '{{}}}',
            '{{}}}',
            '</table>'
        ],
        'help-detial': [
            '<table class="help-detial">',
            '{{for(var n=0; n<it.data.length; n++){}}',
            '<tr>',
            '<td class="help-example">{{=it.data[n].example}}</td>',
            '<td class="help-info">{{=it.data[n].detial}}</td>',
            '</tr>',
            '{{}}}',
            '</table>'
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
