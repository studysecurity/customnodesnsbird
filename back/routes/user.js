const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const Op = db.Sequelize.Op; //옵션
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
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'userNick'], 
                });
                // console.log('백엔드 로그인시 fullUser 값 : ', fullUser);
                return res.json(fullUser);
            } catch(e) {
                next(e);
            }
        });
    })(req, res, next);
});

//쿠키 정보 불러오기
router.get('/', isLoggedIn, (req, res) => {
    //프론트에 password 정보 보여주면 안되서(보안)
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    delete user.userId;
    delete user.userPhone;
    // console.log('백엔드 쿠키값으로 인한 로그인 값 : ', user);
    return res.json(user);
});

//로그아웃 처리
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

//팔로우할 전체 유저 정보들 불러오기
router.post('/followList', isLoggedIn, async (req, res, next) => {
    try {
        const followUserList = await db.User.findAll({
            where: { 
                userNick: {
                    [Op.ne]: req.user.userNick,
                },
            },
            attributes: [ 'id', 'userNick'],
        });

        // console.log('백엔드 값 : ',JSON.stringify(followUserList));

        return res.status(200).json(followUserList);
    } catch(e) {
        console.error(e);
        return next(e);
    }
});

//팔로우 요청
router.post('/follow/:id', isLoggedIn, async (req, res, next) => {
    //이슈 : req.body의 값은 프론트 쪽으로 전달을 못함( 에러남 이유는 모르겠음..)
    // console.log('팔로우 요청이 백엔드로 왔음.');
    // console.log('req.params.id 값(백엔드) : ',req.params.id);
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.addFollowing(req.params.id);
        return res.status(200).send(req.params.id);
    } catch(e) {
        console.error(e);
        return next(e);
    }
});

//언팔로우 (팔로잉)
router.delete('/follow/:id', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });

        await me.removeFollowing(req.params.id);
        return res.status(200).send(req.params.id);
    } catch(e) {
        console.error(e);
        return next(e);
    }
});

//나의 프로필에 팔로잉 정보 가져오기
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { 
                id: parseInt(req.params.id, 10) ||
                (req.user && req.user.id) ||
                0
            },
        });
        
        const followings = await user.getFollowings({
            attributes: ['id', 'userNick'],
            limit: parseInt(req.query.limit, 10),
            offset: parseInt(req.query.offset, 10),
        });
        console.log('myprofile followings 값 : ', JSON.stringify(followings));
        res.status(200).json(followings);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//나의 프로필에 팔로워 정보 가져오기
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0},
        });
        console.dir('나의 프로필 followers 값 : ', JSON.stringify(user));
        const followers = await user.getFollowers({
            attributes: ['id', 'userNick'],
            limit: parseInt(req.query.limit, 10),
            offset: parseInt(req.query.offset, 10),
        });
        res.status(200).json(followers);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//나의 프로필에 팔로워 정보 지우기
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.removeFollower(req.params.id);
        res.status(200).send(req.params.id);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;