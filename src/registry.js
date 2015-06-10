/**
 * 应用程序注册表
 * 主要记录应用程序相关配置，比如权限、默认路径，具体还没想好
 */
define(function (require) {
    return {
        // 应用程序注册信息
        apps: {
            'edit': {
                docs: ['txt']
            }
        },
        // 文件类型注册信息
        docs: {
            'txt': ['edit']
        }
    };
});
