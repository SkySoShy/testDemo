const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const { nanoid } = require("nanoid");
const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://localhost:27017`;
const multer = require("multer");

const token = nanoid();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("*", function (req, res, next) {
    //设为指定的域
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "*");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Methods", "*");
    // res.header(
    //     "Access-Control-Request-Headers",
    //     "Origin, X-requested-With, content-Type,Accept,Authorization"
    // );
    // res.header("Access-Control-Allow-Credentials", true);
    // res.header("X-Powered-By", " 3.2.1");
    next();
});
let loginUser, loginEmail, loginImage;
// 验证用户是否登录
app.get("/user/validate", (req, res) => {
    const token = req.headers.token;
    let result = {};
    if (token && loginUser) {
        result = {
            success: true,
            data: {
                username: loginUser,
                email: loginEmail,
                avatar: loginImage,
            },
        };
    } else {
        result = {
            success: false,
            data: [],
        };
    }
    res.send(JSON.stringify(result));
    // res.send("hello world");
});

//注册
app.post("/user/register", (req, res) => {
    const body = req.body;
    const { username, rpassword, password, email } = body;
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });

    if (rpassword !== password) {
        const result = {
            success: false,
            code: 401,
            msg: "两次输入密码不一致",
        };
        res.end(JSON.stringify(result));
        return;
    }
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbase = db.db("ketang");
        const register = dbase.collection("rigister");
        register.find({ username, password }).toArray(function (err, docs) {
            if (err) {
                const result = {
                    success: false,
                    code: 500,
                    msg: String(err),
                };
                res.end(JSON.stringify(result));
                return;
            }
            if (docs.length === 0) {
                register.insertOne({ username, password, email }, (err) => {
                    if (err) throw err;
                    db.close();
                    const result = {
                        success: true,
                        code: 200,
                        msg: "注册成功",
                    };
                    res.end(JSON.stringify(result));
                    return;
                });
            } else {
                const result = {
                    success: false,
                    code: 500,
                    msg: "注册失败, 用户已存在",
                };
                res.end(JSON.stringify(result));
                return;
            }
            // callback(docs);
        });
    });
});
// 登录
app.post("/user/login", (req, res) => {
    const body = req.body;
    const { username, password } = body;
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbase = db.db("ketang");
        const register = dbase.collection("rigister");
        register.find({ username, password }).toArray(function (err, docs) {
            if (err) {
                const result = {
                    success: false,
                    code: 500,
                    msg: String(err),
                };
                res.end(JSON.stringify(result));
                return;
            }
            db.close();
            if (docs.length === 0) {
                const result = {
                    success: false,
                    code: 500,
                    msg: "登录失败, 用户不存在",
                };
                res.end(JSON.stringify(result));
                return;
            } else {
                const result = {
                    success: true,
                    code: 200,
                    msg: "登录成功",
                    data: {
                        token: token,
                    },
                };
                loginUser = docs[0].username;
                loginEmail = docs[0].email;
                loginImage = docs[0].avatar || false;
                res.end(JSON.stringify(result));
                return;
            }
        });
    });
});
// 获取轮播图列表
app.get("/slider/list");
// 返回课程列表
app.get("lessson/list");
// 返回课程详情
app.get("/lesson/:id");
// 上传头像

let storage = multer.diskStorage({
    //设置存储路径
    destination: path.resolve(__dirname + "/uploads"),
    //设置存储的文件名
    filename: (req, file, cb) => {
        console.log("filename:", file); //打印结果如下图
        //获取文件的扩展名
        let extname = path.extname(file.originalname);
        cb(null, Date.now() + extname);
    },
});
const upload = multer({ storage });
app.post("/user/uploadAvatar", upload.single("avatar"), (req, res) => {
    const { userId } = req.body;
    const domain =
        process.env.DOMAIN || `${req.protocol}://${req.headers.host}`;
    let avatar = `${domain}/uploads/${req.file.filename}`;
    res.end(
        JSON.stringify({
            success: true,
            data: avatar,
        })
    );
});

app.get("/uploads/*", (req, res) => {
    // console.log(req.url)
    res.sendFile(__dirname + req.url);
});
app.listen("3000", () => {
    console.log("启动于:" + ":3000");
});
