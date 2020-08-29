// 实现Router和应用的分离
const Router = require("./router");
const http = require('http');

function Application() {
    /**
     * 私有属性
     */
    this._router = new Router(); // 这是一个路由规则的窗口
}

/**
 * @description app.get 添加路由
 * @param {*} path 
 * @param {*} handler 
 */
Application.prototype.get = function (path, handler) {
    // this._router.push({
    //     path,
    //     handler,
    //     method: "get"
    // });
    // ?????
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