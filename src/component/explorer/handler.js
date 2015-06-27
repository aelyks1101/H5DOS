define(function (require) {
    return {
        keydown: function (evt) {
            if (evt.target.tagName === 'BODY') {
                if (evt.code === 8 || (evt.code === 37 && evt.alt)) {
                    this.previousDirectory();
                }
                else if (evt.code === 39 && evt.alt) {
                    this.nextDirectory();
                }
                else if (evt.code === 38 && evt.alt) {
                    this.fatherDirectory();
                }
                else if (evt.code === 78 && evt.alt) {
                    this.createFolder('create');
                }
            }
            else if (evt.target.dataset.com === 'explorer') {
                if (evt.target.dataset.cmd === 'foldername' && evt.code === 13) {
                    this.createFolder({type: 'create', path: evt.target.value});
                }
            }
        },
        click: function (evt) {
            var data = evt.target.dataset;
            var com = this._ui[data.com];
            if (
                data.com && com && com._handler
                && typeof com._handler.click === 'function'
            ) {
                com._handler.click(evt);
            }
            else if (data.com === 'explorer') {
                if (data.cmd === 'prev') {
                    this.previousDirectory();
                }
                else if (data.cmd === 'next') {
                    this.nextDirectory();
                }
                else if (data.cmd === 'up') {
                    this.fatherDirectory();
                }
                else if (data.cmd === 'createfolder') {
                    this.createFolder('create');
                }
            }
        }
    };
});