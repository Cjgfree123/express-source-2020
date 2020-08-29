/**
 * @description Route 路由实例
 * route.dispatch
 * route.get
 */
const Layer = require('./layer');
const methods = require('methods');
const slice = Array.prototype.slice;

function Route(path) {
    this.path = path;
    this.stack = [];
    // 表示此路由中，有此方法的处理函数
    this.methods = {};
}

methods.forEach(function (method) {
    Route.prototype[method] = function () {
        let handlers = slice.call(arguments);
        this.methods[method] = true;
        for (let i = 0; i < handlers.length; i++) {
            // layer: { method, handler }
            let layer = new Layer("/", handlers[i]);
            layer.method = method;
            this.stack.push(layer);
        }
        return this;
    }
})

Route.prototype.handle_method = function (method) {
    method = method.toLowerCase();
    return this.methods[method];
}

/**
 * @description 遍历当前route layer, 如果方法名匹配，则执行
 * @param {*} req 
 * @param {*} res 
 * @param {*} out 垂直跨层。即当前route layer已经遍历完毕，需要进入下一个Router layer.
 */
Route.prototype.dispatch = function (req, res, out) {
    let idx = 0, self = this;
    function next() {
        // 如果当前layer遍历完毕，则跳到下一层Router Layer
        if (idx >= self.stack.length) {
            return out();
        }
        // 拿出Route当前层
        let layer = self.stack[idx++];
        // 通过方法名，进行匹配
        if (layer.method === req.method.toLowerCase()) {
            layer.handle_request(req, res, next);
        } else {
            next();
        }
    }
    next();
}

module.exports = Route;