define(function (require) {
    return {
        _keydown: function (evt) {
            if (evt.alt && evt.code === 81) {
                this.quit();
            }
            if (evt.ctrl && evt.code === 83) {
                this.save();
            }
            if (evt.alt && evt.code === 78) {
                this.newFile();
            }
        },
        _resize: function (evt) {
            this.resize(evt);
        },
        click: function (evt) {
            var cmd = evt.target.dataset.cmd;
            if (cmd === 'quit') {
                this.quit();
            }
            else if (cmd === 'save') {
                this.save();
            }
            else if (cmd === 'new') {
                this.newFile();
            }
        }
    };
});
