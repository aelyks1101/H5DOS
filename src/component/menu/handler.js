define(function (require) {
    return {
        click: function (evt) {
            if (
                evt.target.dataset.com === 'menu'
                && typeof this._callback === 'function'
            ) {
                this._callback({
                    type: 'menu-click',
                    cmd: evt.target.dataset.cmd
                });
            }
        }
    };
});
