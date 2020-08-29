/**
 * @description Route 路由实例
 * route.dispatch
 * route.get
 */
const Layer = require('./layer');

function Route(path){
    this.path = path;
    this.stack = [];
    // 表示此路由中，有此方法的处理函数
    this.methods = {};
}

Route.prototype.get = function(handler){
    // layer: { method, handler }
    let layer = new Layer("/", handler);
    // layer.method = method; ???
    this.methods["get"] = true;
    this.stack.push(layer);
}

Route.prototype.dispatch = function(req, res, out){
    // todo
}

module.exports = Route;