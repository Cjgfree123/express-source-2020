# express-source-2020

## 目录

```
test
    |__1.get.js // 使用demo
lib
    |__express.js // 提供创建app实例的函数，即:express
    |__application.js // 返回创建的app实例
```

## 步骤

一、1.get.js 实现简单服务器 & 路由。

（一）实现服务器

  -  定义函数createApplication，该函数返回一个对象作为app实例。
  - 该函数返回的对象上，挂载listen方法，listen内处理: (1)http.createServer创建server实例 (2)server.listen.apply(server, arguments);

（二）实现router

    - 定义router数组，使用path/method/handler描述。

    ```
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
    ```

    - 在createApplication返回值上, 添加get属性，来将app.get()的路由信息(path/handler), 添加到router数组中。

    - 在app.listen时, 拿到页面路径，一一遍历router数组，优先匹配path, 再匹配method, 如果都符合才执行handler. 如果未命中所有的路由，则报错。
    

二、2.router.js 实现路由

（一）抽离

    - 将 createApplication 返回的实例，进行抽离到Application.js文件里，并将app.get/app.listen抽离成原型属性。

    ```
    function Application() {
       
    }

    Application.prototype.get = function (path, handler) {

    }

    Application.prototype.listen = function () {
    }
    ```

    - 将Router作为私有属性

    ```
    function Application() {
        /**
        * 私有属性
        */
        this._router = new Router(); // 这是一个路由规则的窗口
    }
    ```

（二）