// 这是一个路由规则的窗口
let router = [
    {
        path: "*",
        method: "*",
        // 当没命中path时，执行该函数
        handler(req, res) {
            res.end(`cannot ${req.method} ${req.url}`);
        }
    }
];

const http = require('http');
const url = require('url');

/**
 * @description 相当于express类, 用来创建app实例
 * 提供app.get / app.listen 属性。
 */
function createApplication() {
    // 返回app实例
    return {
        get(path, handler) {
            router.push({
                path,
                handler,
                method: "get"
            });
        },
        listen() {
            let server = http.createServer(function (req, res) {
                let { pathname } = url.parse(req.url, true);
                // 因为优先走我们自己的规则，所以从1开始遍历
                for (let i = 1; i < router.length; i++) {
                    let {
                        path,
                        method,
                        handler,
                    } = router[i];
                    // 优先匹配path, 再匹配method, 如果都符合才执行handler.
                    if (pathname === path && method === req.method.toLowerCase()) {
                        return handler(req, res);
                    }
                }
                // 如果未命中所有的路由，则报错。
                router[0].handler(req, res);
            });
            server.listen.apply(server, arguments);
        }

    }
}

module.exports = createApplication;