/**
 * 系统常量
 * @param {Function} require require方法
 * @return {Object} 系统配置对象
 */
define(function (require) {

    return {
        // 版本号
        version: '0.1.0610',
        // 语言
        language: 'en',
        // 文件系统类型
        fsType: window.TEMPORARY,
        // 文件空间大小
        fsSize: 1024 * 1024 * 100,
        // 文件系统是否调试
        fsDebug: false
    };

});
