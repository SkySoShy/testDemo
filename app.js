const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("*", function (req, res, next) {
    //设为指定的域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Methods", "*");
    // res.header("Access-Control-Allow-Credentials", true);
    // res.header("X-Powered-By", " 3.2.1");
    next();
});
// 验证用户是否登录
app.get("/user/validate", (req, res) => {
    console.log(req);
    const result = {
        success: false,
        data: [],
    };
    res.send(JSON.stringify(result));
    // res.send("hello world");
});

//注册
app.post("/user/register", (req, res) => {
    const body = req.body;
    console.log(body)
});
// 登录
app.post("/user/login");
// 获取轮播图列表
app.get("/slider/list");
// 返回课程列表
app.get("lessson/list");
// 返回课程详情
app.get("/lesson/:id");
// 上传头像
app.post("/user/uploadAvatar");

app.listen("3000", () => {
    console.log("启动");
});
