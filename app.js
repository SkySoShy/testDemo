const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://localhost:27017`;

// MongoClient.connect(url, (err, db) => {
//     if (err) throw err;
//     console.log("数据库已经创建");
//     const dbase = db.db("register");
// var myobj = [
//     { name: "菜鸟工具", url: "https://c.runoob.com", type: "cn" },
//     { name: "Google", url: "https://www.google.com", type: "en" },
//     { name: "Facebook", url: "https://www.google.com", type: "en" },
// ];
//     // const myobj = { name: "cainiao", url: "www.runoob" };
//     // dbase.collection("site").insertOne(myobj, (err, res) => {
//     dbase.collection("site").insertMany(myobj, (err, res) => {
//         if (err) throw err;
//         console.log("文档插入成功");
//         db.close();
//     });
// });

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
    const { username, rpassword, password, email } = body;
    if (rpassword !== password) {
        const result = {
            success: false,
            code: 401,
            msg: "两次输入密码不一致",
        };
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end(JSON.stringify(result));
        return;
    }
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbase = db.db("ketang");
        dbase
            .collection("rigister")
            .insertOne({ username, password, email }, (err, res) => {
                if (err) throw err;
                db.close();
            });
    });
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
