const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();

// //GET /api/user 회원가입(아이디 중복 검사)
// router.get('/signup/:data', async (req, res, next) => {
//     try {
//         // console.log('궁금 : ',JSON.stringify(req.params.userId));
//         // console.log("유저가 디비에 존재하냐? : ",req.User);
//         // if (req.User) {
//         //     const exUser = await db.User.findOne({
//         //         where: {
//         //             userId: req.body.userId,
//         //         },
//         //     });
            
//         //     //아이디 중복
//         //     if (exUser) {
//         //         return res.status(403).send('이미 사용중인 아이디입니다.');
//         //     }
//         // }
//         // return res.status(200).send('사용 가능한 아이디입니다.');
//         con
//     } catch(e) {
//         console.error(e);
//         next(e);
//     }
// });

//POST /api/user 회원가입
router.post('/signup', async (req, res, next) => {
    try {
        console.log('값 : '+JSON.stringify(req.body));
        console.log('userId 값 : '+req.body.userId);
        console.log('userNick 값 : '+req.body.userNick);
         //ID 중복 여부 확인
        //  console.log('userId 값 : '+req.body.userId);
        //  const idDuplicateCheck = await db.User.findOne({
        //     where: {
        //         userId: req.body.userId,
        //     },
        //  });
         
        //  if(idDuplicateCheck) {
        //      return res.status(403).send('이미 사용중인 아이디입니다.');
        //  }
         
        //  const hashedPassword = await bcrypt.hash(req.body.password, 12);
        //  //새 유저 생성
        //  const newUser = await db.User.create({
        //     nickname: req.body.nickname,
        //  });
        //  console.log('new User 값 : '+newUser);
        //  return res.status(200).json(newUser);
    } catch(e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;