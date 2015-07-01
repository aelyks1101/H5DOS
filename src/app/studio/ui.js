define(
    [
        'ace/ace',
        'component/explorer/main',
        'component/menu/main'
    ],
    function (ace, explorer, menu) {
        return {
            editor: {
                core: null,
                initialize: function (dom) {
                    this.core = ace.edit(dom);
                    this.core.$blockScrolling = Infinity;
                    this.core.setTheme('ace/theme/monokai');
                    this.core.getSession().setMode('ace/mode/javascript');
                    this.core.setFontSize(18);
                },
                code: function (str) {
                    this.core.setValue(str, str.length);
                    this.core.focus();
                }
            },
            explorer: explorer,
            menu: menu
        };
    }
);
