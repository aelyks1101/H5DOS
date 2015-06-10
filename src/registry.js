/**
 * 应用程序注册表
 * 主要记录应用程序相关配置，比如权限、默认路径，具体还没想好
 * @param {Function} require require方法
 * @return {Object} 注册表配置对象
 */
define(function (require) {
    return {
        // 应用程序注册信息
        apps: {
            'edit': {},
            'bat': {}
        },
        // 文件类型注册信息
        docs: {
            'txt': ['edit'],
            'bat': ['bat']
        }
    };
});
