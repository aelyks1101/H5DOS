define(function (require) {
    return {
        _keydown: function (evt) {
            this.hotkey(evt);
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
        },
        change: function (evt) {
            for (var key in this.ui) {
                if (
                    this.ui[key]._handler
                    && typeof this.ui[key]._handler.change === 'function'
                ) {
                    this.ui[key]._handler.change(evt);
                }
            }
        }
    };
});
