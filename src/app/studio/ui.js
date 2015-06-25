define(
    [
        'ace/ace',
        'component/explorer/main',
        'component/menu/main'
    ],
    function (ace, explorer, menu) {
        return {
            ace: ace,
            explorer: explorer,
            menu: menu
        };
    }
);
