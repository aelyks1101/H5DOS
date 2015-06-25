define(function (require) {
    return {
        _keydown: function (evt) {
            if (evt.alt && evt.code === 81) {
                this.quit();
            }
            if (evt.ctrl && evt.code === 83) {
                // this.save();
            }
            if (evt.alt && evt.code === 78) {
                // this.newFile();
            }
        },
        click: function (evt) {
            for (var key in this.ui) {
                if (
                    this.ui[key]._handler
                    && typeof this.ui[key]._handler.click === 'function'
                ) {
                    this.ui[key]._handler.click(evt);
                }
            }
        }
    };
});
