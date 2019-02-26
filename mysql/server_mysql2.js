const express = require('express');
const expressStatic = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');
const mysql = require('mysql');

//连接池
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'blog'
});

let server = express();
server.listen(8848);

//1.解析cookie
server.use(cookieParser('sdfasl43kjoifguokn4lkhoifo4k3'));

//2.使用session
let arr = [];
for (let i = 0; i < 100000; i++) {
    arr.push('keys_' + Math.random());
}
server.use(cookieSession({name: 'zns_sess_id', keys: arr, maxAge: 20 * 3600 * 1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/upload'}).any());

//4.配置模板引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './template');
//哪种模板引擎
server.engine('html', consolidate.ejs);

//接收用户请求
server.get('/index', (req, res, next) => {
    //查询banner的东西
    db.query("SELECT * FROM banner_table", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database error').end();
        } else {
            res.banners = data;
            next();
        }
    });
});
server.get('/index', (req, res, next) => {
    //查询banner的东西
    db.query("SELECT `title`,`summary` FROM article_table", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database error').end();
        } else {
            res.article = data;
            next();
        }
    });
});
server.get('/index', (req, res)=> {
    db.query("SELECT * FROM user_table", (err, data)=> {
        if (err) {
            console.log(err)
        } else {
            res.render('index.ejs', {banners: res.banners, article: res.article});
        }
    })
});


//4.static数据
server.use(expressStatic('./www'));


