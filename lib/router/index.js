const Route = require("./route");
const Layer = require("./layer");

function Router(){
    this.stack = [];
};

/**
 * @description 1.创建Route实例 2.向当前路由系统中添加一个层layer
 * @param {*} path 
 */
Router.prototype.route = function(path){
    let route = new Route(path);
    // 当创建layer实例，需要传入route.dispatch.bind(route) ????
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
};

/**
 * @description 当执行new Router().get(path, handler)时, 等于new route(path).get(handler)来执行对应函数
 */
Router.prototype.get = function(path, handler){
    let route = this.route(path);
    route.get(handler);
};

module.exports = Router;