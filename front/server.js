const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

//배포 여부
const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
    const server = express();

    server.use(morgan('dev'));
    //favicon 설정
    server.use('/', express.static(path.join(__dirname, 'public')));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser(process.env.COOKIE_SECRET));
    //참고 사이트
    //https://github.com/expressjs/session
    server.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
        httpOnly: true,
        secure: false,
        },
    }));

    //개별 포스트 불러오기
    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(prod ? process.env.PORT : 3060, () => {
        console.log(`next+express running on port ${process.env.PORT}`);
    });
});