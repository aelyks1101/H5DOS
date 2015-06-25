define(['doT'], function (doT) {
    var clickBtn = 'data-com="menu" data-cmd="{{=cmd}}"';
    var item = [
        '<div class="menu-item-checked">{{=checked}}</div>',
        '<div class="menu-item-label" ' + clickBtn + '>{{=label}}</div>',
        '<div class="menu-item-hotkey" ' + clickBtn + '>{{=hotkey}}</div>'
    ];
    var children = [
        '<div class="menu-list-2">',
        '{{for(var p=0;p<children.length;p++){}}',
        '{{var cmd=children[p].cmd?children[p].cmd:"";}}',
        '{{var disable=children[p].disable?"menu-item-disable":"";}}',
        '{{var checked=children[p].checked?"√":"";}}',
        '{{var hotkey=children[p].hotkey?children[p].hotkey:"&nbsp;";}}',
        '{{var label=children[p].label;}}',
        '{{if(children[p].cutline){}}',
        '<div class="menu-cutline"><div class="head"></div><hr></div>',
        '{{continue;}}}',
        '<div class="menu-item {{=disable}}">',
        item.join(''),
        '</div>',
        '{{}}}',
        '</div>'
    ];
    var list = [
        '<div class="menu-list-1">',
        '{{for(var m=0;m<list.length;m++){}}',
        '{{var disable=list[m].disable?"menu-item-disable":"";}}',
        '{{var checked=list[m].checked?"√":"";}}',
        '{{var hotkey=list[m].hotkey?list[m].hotkey:"&nbsp;";}}',
        '{{var label=list[m].label?list[m].label:"&nbsp;";}}',
        '{{var cmd=list[m].cmd?list[m].cmd:"&nbsp;";}}',
        '{{if(list[m].cutline){}}',
        '<div class="menu-cutline"><div class="head"></div><hr></div>',
        '{{continue;}}}',
        '<div class="menu-item {{=disable}}">',
        item.join(''),
        '{{if(list[m].items instanceof Array){}}',
        '<div class="menu-item-child"></div>',
        '{{var children=list[m].items;}}',
        children.join(''),
        '{{}}}',
        '</div>',
        '{{}}}',
        '</div>'
    ];
    var button = [
        '{{var disable=button.disable?"menu-button-disable":"";}}',
        '{{var cmd=button.cmd?button.cmd:"";}}',
        '{{var label=button.label?button.label:"";}}',
        '<div class="menu-button {{=disable}}">',
        '<div class="menu-button-label" ' + clickBtn + '>{{=label}}</div>',
        '{{if(button.items instanceof Array){}}',
        '{{var list=button.items;}}',
        list.join(''),
        '{{}}}',
        '</div>'
    ];
    var menu = [
        '{{for(var n=0;n<it.menu.length;n++){}}',
        '{{var button=it.menu[n];}}',
        button.join(''),
        '{{}}}'
    ];
    return doT.template(menu.join(''), undefined);
});
