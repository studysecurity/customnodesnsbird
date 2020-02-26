const express = require('express');
const db = require('../models');
const { Op } = require("sequelize");
const { isLoggedIn } = require('./middleware');

const router = express.Router();

//메인 게시글들 불러오기
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
            //팔로우 정보
            const user = await db.User.findOne({
                attributes: ['id', 'userNick'],
                where: {
                    id: {
                        [Op.eq]: req.user.id,
                    },
                },
                include: [{
                    model: db.User,
                    through: 'Follow',
                    as: 'Followings',
                    attributes: ['id'],
                }],
            });
            // console.log('백엔드 follow 값 :', JSON.stringify(user));

            //전체 게시글
            const posts = await db.Post.findAll({
                where: {
                    auth: {
                        [Op.eq]: 0,
                    },
                },
                include: [{
                    model: db.User,
                    attributes: ['id', 'userNick'],
                }, {
                    model: db.Image,
                    attributes: ['id', 'src', 'PostId'],
                }, {
                    model: db.Hashtag,
                    attributes: ['id', 'tagName'],
                    through: {
                        attributes: ['HashtagId'],
                    },
                }, {
                    model: db.User,
                    through: 'Like',
                    as: 'Likers',
                    attributes: ['id'],
                }],
                order: [['createdAt', 'DESC']], //DESC 내림차순
            });
            console.log('posts 값 : ', JSON.stringify(posts));

            const test = user.Followings.map(following => following.id);
            console.log('test 값 : ', test); 
            const followPosts = await db.Post.findAll({
                where: {
                    auth: {
                        [Op.eq]: 1,
                    },
                    UserId: {
                        //이부분에 팔로우한 사람의 정보를 가져오는 조건문
                        [Op.in]: test,
                    },
                },
                include: [{
                    model: db.User,
                    attributes: ['id', 'userNick'],
                }, {
                    model: db.Image,
                    attributes: ['id', 'src', 'PostId'],
                }, {
                    model: db.Hashtag,
                    attributes: ['id', 'tagName'],
                    through: {
                        attributes: ['HashtagId'],
                    },
                }, {
                    model: db.User,
                    through: 'Like',
                    as: 'Likers',
                    attributes: ['id'],
                }],
                order: [['createdAt', 'DESC']], //DESC 내림차순
            });
            console.log('followPosts 값 : ', JSON.stringify(followPosts));

            const mainPosts = posts.concat(followPosts).reverse();
            console.log('mainPosts 값 : ', JSON.stringify(mainPosts));
            
            res.status(200).json(mainPosts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;