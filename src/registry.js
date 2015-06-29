/**
 * 应用程序注册表
 * 主要记录应用程序相关配置，比如权限、默认路径，具体还没想好
 * @param {Function} require require方法
 * @return {Object} 注册表配置对象
 */
define(function (require) {
    return {
        // 应用程序注册信息，记录可用的程序
        apps: {
            'run': {},
            'edit': {},
            'studio': {logfile: '/.sys/log-studio'},
            'bat': {visible: false}
        },
        // 文件类型注册信息，记录文件打开程序列表
        docs: {
            'js': ['studio'],
            'txt': ['edit'],
            'bat': ['bat']
        },
        // 系统启动自运行
        autorun: [
            '/src/efg/main.js'
        ]
    };
});
