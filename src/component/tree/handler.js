define(function (require) {
    return {
        click: function (evt) {
            var cmd = evt.target.dataset.cmd;
            if (cmd === 'toggle') {
                var parent = $(evt.target.parentNode);
                parent.toggleClass('hideChildren');
                if (parent.hasClass('hideChildren')) {
                    evt.target.innerHTML = '&#xe605;';
                }
                else {
                    evt.target.innerHTML = '&#xe607;';
                }
            }
            else if (cmd === 'file' || cmd === 'folder') {
                if (typeof this._callback === 'function') {
                    this._callback({
                        type: 'tree-' + cmd,
                        path: evt.target.dataset.path
                    });
                }
            }
        }
    };
});
