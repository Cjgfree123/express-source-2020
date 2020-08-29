// 实现Router和应用的分离
const { Router } = require("./router");
const http = require('http');
const url = require('url');

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
    this._router.push({
        path,
        handler,
        method: "get"
    });
}

/**
 * @description app.listen
 * 作用: 匹配路由，命中后执行handler.
 */
Application.prototype.listen = function () {
    let self = this;
    let server = http.createServer(function (req, res) {
        let { pathname } = url.parse(req.url, true);
        // 因为优先走我们自己的规则，所以从1开始遍历
        for (let i = 1; i < self._router.length; i++) {
            let {
                path,
                method,
                handler,
            } = self._router[i];
            // 优先匹配path, 再匹配method, 如果都符合才执行handler.
            if (pathname === path && method === req.method.toLowerCase()) {
                return handler(req, res);
            }
        }
        // 如果未命中所有的路由，则报错。
        _router[0].handler(req, res);
    });
    server.listen.apply(server, arguments);
}
