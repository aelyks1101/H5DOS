define(['config'], function (config) {
    function language(lng) {
        var obj = {
            en: {
                nofile: 'Please specify a ".js" file.'
            }
        };
        var rlng = {};
        if (obj[lng]) {
            rlng = obj[lng];
        }
        else {
            rlng = obj.en;
        }
        return rlng;
    }
    return language(config.language);
});
