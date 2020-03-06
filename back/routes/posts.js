const express = require('express');
const db = require('../models');
const { Op } = require("sequelize");
const { isLoggedIn } = require('./middleware');

const router = express.Router();

//메인 게시글들 불러오기
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
            //인피니티 스크롤
            // console.log('lastId 값 : ', req.query.lastId);
            let where = {};
            if (parseInt(req.query.lastId, 10)) {
                where = {
                    auth: {
                        [Op.eq]: 0,
                    },
                    id: {
                        [Op.lt]: parseInt(req.query.lastId, 10),
                    },
                };
            }
            // console.log('where 1값 : ', where);

            //전체 게시글
            const posts = await db.Post.findAll({
                where,
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
                limit: parseInt(req.query.limit, 10),
            });
            // console.log('posts 값 : ', JSON.stringify(posts));
            // console.log('where 2값 : ', where);

            res.status(200).json(posts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;