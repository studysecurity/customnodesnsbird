const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const hpp = require('hpp');
const helmet = require('helmet');

const passportConfig = require('./passport')
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const prod = process.env.NODE_ENV === 'production';

//dotenv의 중요정보 저장 후 가져와서 사용(보안)
dotenv.config();
//익스프레스 기본설정
const app = express();
//DB 테이블 생성
db.sequelize.sync();
//로그인 여부 처리
passportConfig();

//배포 모드일때
if (prod) {
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({

    }));
} else {
    //서버의 로그기록 남기는데 사용 (express에서 로그를 안남겨주므로 별도로 해줘야함)
    app.use(morgan('dev'));
    //사용 이유 : localhost:3000 (front)와 localhost:3065(back)은 다른페이지와 통신을 하려면 cors필요
    app.use(cors({
        //쿠키 정보를 주고받음(백과 프론트쪽 통신)
        origin: true,
        credentials: true,
    }));
}

//json 형식의 본문 및 request body에 값을 넣어주는 역할
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//파일 업로드 경로
app.use('/', express.static('uploads'));

//쿠키
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false, //매번 세션 강제 저장
    saveUninitialized: false, //빈 값도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: { 
        //자바스크립트로 쿠키 접근 금지(보안)
        httpOnly: true,
        //https 사용시 true
        secure: false, 
        domain: prod && '.nodesnsbird.ga', //서브 도메인도 쿠키 값을 받을 수 있게 사용
    },
    //익스프레스 디폴트 쿠키 아이디를 다른걸로 변경(디폴트 이름이면 익스프레스인지 알수 있어 
    //익스프레스 취약점으로 공격할 수 있어서
    name: 'rnbck'
    // 캐시정보의 대한 시스템을 명시해서 사용 가능
    // store: '~~'
}));

//passport가 로그인한 정보를 알고있음(프론트, 백)
app.use(passport.initialize());
app.use(passport.session());

//프론트에서 서버에 요청 동작하는 부분은 여기
app.get('/', (req, res) => {
    res.send('react 백엔드 정상 동작');
});

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(prod ? process.env.PORT : 3065, () => {
    console.log(`server is running on ${process.env.PORT}`);
});