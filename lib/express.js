const Application = require('./application');

/**
 * @description 相当于express类, 用来创建app实例
 * 提供app.get / app.listen 属性。
 */
function createApplication() {
    // 返回app实例
    return new Application();
}

module.exports = createApplication;