const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

//POST /api/user/signup 회원가입
router.post('/signup', async (req, res, next) => {
    try {
        // console.log('값 1 : ', req.body.userId);
        // console.log('값 2 : ', req.body.password);
        // console.log('값 3 : ', req.body.userNick);
        // console.log('값 4 : ', req.body.phone);

        const hashedPassword = await bcrypt.hash(req.body.password, 12); //비밀번호 암호화
        //새 유저 DB에 저장
        const newUser = await db.User.create({
            userNick: req.body.userNick,
            userId: req.body.userId,
            password: hashedPassword,
            userPhone: req.body.phone,
        });
        // console.log(newUser);
        return res.status(200).send('회원가입에 성공하셨습니다. 축하드립니다.');
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//POST /api/user/signup/check 회원가입(중복아이디, 중복 닉네임 체크)
router.post('/signup/check', async (req, res, next) => {
    try {
        // console.log('값 : '+JSON.stringify(req.body));
        // console.log('userId 값 : '+req.body.userId);
        // console.log('userNick 값 : '+req.body.userNick);
        //아이디 중복검사
        if (req.body.userId) {
            // console.log('userID 하하하하하하');
            
            const exUserId = await db.User.findOne({
                where: {
                    userId: req.body.userId,
                },
            });

            //중복 아이디 존재
            if (exUserId) {
                return res.status(403).send('이미 사용중인 아이디입니다.');
            } else {
                return res.status(200).send('사용 가능한 아이디입니다.');
            }
        } else if(req.body.userNick) { //닉네임 중복검사
            // console.log('userNick 호호호호호호');
            
            const exUserNick = await db.User.findOne({
                where: {
                    userNick: req.body.userNick,
                },
            });

            //중복 닉네임 존재
            if (exUserNick) {
                return res.status(403).send('이미 사용중인 닉네임입니다.');
            } else {
                return res.status(200).send('사용 가능한 닉네임입니다.');
            }
        } 
    } catch(e) {
        console.error(e);
        return next(e);
    }
});

//POST /api/user/login
router.post('/login', (req, res, next) => {
    //passport폴더의 passport 정보를 가져온다.
    //passport/local.js 실행 후의 인증 결과 값을 받아오는 역할
    passport.authenticate('local', (err, user, info) => {
        //로그인 요청 실패 사유
        if(err) {
            console.error(err);
            return next(err);
        }
        //로그인 에러 사유
        if(info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            try{
                //로그인 에러
                if(loginErr) {
                    return next(loginErr);
                }

                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'userNick', 'userId'], 
                });
                // console.log(fullUser);
                return res.json(fullUser);
            } catch(e) {
                next(e);
            }
        });
    })(req, res, next);

    // try {
    //     console.log('login 값 : ', req.body);

    //     const loginUser = await db.User.findOne({
    //         where: { 
    //             userId: req.body.userId,
    //         },
    //         attributes: ['password'],
    //     });

    //     const result = await bcrypt.compare(req.body.password, loginUser.password);

    //     // console.log('궁금 ', result);
    //     if (loginUser) {
    //         return res.status(200).json(loginUser);
    //     } else {
    //         return res.status(403).send('로그인 실패');
    //     }
    // } catch(e) {
    //     console.error(e);
    //     return next(e);
    // }
});

router.get('/', isLoggedIn, (req, res) => {
    //프론트에 password 정보 보여주면 안되서(보안)
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    delete user.phone;
    return res.json(user);
});

//로그아웃 처리
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

module.exports = router;