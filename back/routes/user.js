const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');

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
router.post('/login', async (req, res, next) => {
    try {
        console.log('login 값 : ', req.body);

        const loginUser = await db.User.findOne({
            where: { 
                userId: req.body.userId,
            },
            attributes: ['password'],
        });

        const result = await bcrypt.compare(req.body.password, loginUser.password);

        console.log('궁금 ', result);
        // if (loginUser) {
        //     return res.status(200).json(loginUser);
        // } else {
        //     return res.status(403).send('로그인 실패');
        // }
    } catch(e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;