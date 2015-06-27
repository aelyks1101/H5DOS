define(function (require) {
    return {
        click: function (evt) {
            var cmd = evt.target.dataset.cmd;
            if (
                (cmd === 'file' || cmd === 'folder')
                && typeof this._callback === 'function'
            ) {
                this._callback({
                    type: 'tree-' + cmd,
                    path: evt.target.dataset.path
                });
            }
        }
    };
});
