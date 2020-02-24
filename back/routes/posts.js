const express = require('express');
const db = require('../models');

const router = express.Router();

//메인 게시글들 불러오기
router.get('/', async (req, res, next) => {
    try {
        const posts = await db.Post.findAll({
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
                model: db.PostAuthority,
                attributes: ['auth'],
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
            order: [['createdAt', 'DESC']], //DESC 내림차순
        });
        // console.log('posts 값 : ', JSON.stringify(posts));
        // console.log('posts 값 22222222 : ', posts);
        res.status(200).json(posts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;