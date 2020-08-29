const Route = require("./route");
const Layer = require("./layer");
const url = require("url");
const methods = require("methods");
const slice = Array.prototype.slice;

function Router() {
    this.stack = [];
};

/**
 * @description 1.创建Route实例 2.向当前Router中添加一个层layer
 * @param {*} path 
 */
Router.prototype.route = function (path) {
    let route = new Route(path);
    // 当创建layer实例，需要传入route.dispatch.bind(route) ????
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
};

methods.forEach(function (method) {
    Router.prototype[method] = function (path) {
        // 往Router里边添加一层
        let route = this.route(path);
        // 向route里边添加一层
        route[method].apply(route, slice.call(arguments, 1));
        return this;
    }
})

/**
 * @description 当执行new Router().get(path, handler)时, 等于new route(path).get(handler)来执行对应函数
 */

/**
 * @description 匹配path, 如果命中, 则执行route layer中函数
 * @param {*} req 
 * @param {*} res 
 * @param {*} out 没命中路由时的函数
 */
Router.prototype.handle = function (req, res, out) {
    let idx = 0, self = this;
    let {
        pathname,
    } = url.parse(req.url, true);
    function next() {
        if (idx >= self.stack.length) {
            // 如果所有的路由都没有命中, 则执行该函数
            // route.dispatch里边的out, 刚好是Router.next();
            return out();
        }
        let layer = self.stack[idx++];
        // handle_method: 判断layer中是否有请求包含的方法method
        if (layer.match(pathname) && layer.route && layer.route.handle_method(req.method.toLowerCase())) {
            layer.handle_request(req, res, next);
        } else {
            // 如果不匹配，则匹配下一层 Router Layer.
            next();
        }
    }
    next();
}

module.exports = Router;