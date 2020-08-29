// 实现Router和应用的分离
const Router = require("./router");
const http = require('http');
const methods = require("methods"); // ["get", "post"]
const slice = Array.prototype.slice;

function Application() {
    /**
     * 私有属性
     */
    this._router = new Router(); // 这是一个路由规则的窗口
}

Application.prototype.lazyRouter = function(){
    if(!this._router){
        this._router = new Router();
    }
}

methods.forEach(function (method){
    Application.prototype[method] = function(){
        this.lazyRouter();
        // 这样写可以支持多个处理函数
        this._router[method].apply(this._router, slice.call(arguments));
        return this;
    }
})

/**
 * @description app.get 添加路由
 * @param {*} path 
 * @param {*} handler 
 */
Application.prototype.get = function (path, handler) {
    this.lazyRouter();
    this._router.get(path, handler);
}

/**
 * @description app.listen
 * 作用: 匹配路由，命中后执行handler.
 */
Application.prototype.listen = function () {
    let self = this;
    let server = http.createServer(function (req, res) {
        function done(){
            res.end(`cannot ${req.method} ${req.url}`);
        }
        // 如果没有一条路由规则和请求匹配，则把请求交给done.
        self._router.handle(req, res, done)
    });
    server.listen.apply(server, arguments);
}

module.exports = Application;