const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const db = require('./models');
const userAPIRouter = require('./routes/user');

//dotenv의 중요정보 저장 후 가져와서 사용(보안)
dotenv.config();
//익스프레스 기본설정
const app = express();
//DB 테이블 생성
db.sequelize.sync();
//서버의 로그기록 남기는데 사용 (express에서 로그를 안남겨주므로 별도로 해줘야함)
app.use(morgan('dev'));
//CORS
app.use(cors());

//json 형식의 본문 및 request body에 값을 넣어주는 역할
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//프론트에서 서버에 요청 동작하는 부분은 여기
app.get('/', (req, res) => {
    res.send('react 백엔드 정상 동작');
});

app.use('/api/user', userAPIRouter);

app.listen(3065, () => {
    console.log('server is running on 3065');
});