const express = require('../lib/express');
const app = express();

// next: 表示执行下一个
/**
 * 路径分组: 将相同路径的接口，只匹配一次即可。
 */
app.get('/', function (req, res, next) {
    console.log(1);
    // 如果任何出错了, 会把错误交给next, 然后会跳过后面所有的正常处理函数, 交给错误中间件来处理。
    next();
}, function (req, res, next) {
    console.log(11); // 为何111 打印不出来??????
    next();
})
app.get('/2', function (req, res, next) {
    console.log(2);
    next();
})
app.get('/', function (req, res, next) {
    console.log(3);
    res.end('ok');
});
app.listen(3000, () => console.log("port at 3000"));
