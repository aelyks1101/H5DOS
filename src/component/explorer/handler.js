define(function (require) {
    return {
        click: function (evt) {
            var data = evt.target.dataset;
            var com = this._ui[data.com];
            if (
                data.com && com && com._handler
                && typeof com._handler.click === 'function'
            ) {
                com._handler.click(evt);
            }
        }
    };
});
