const express = require('express');
const db = require('../models');
const { Op } = require("sequelize");
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/:tag', isLoggedIn, async (req, res, next) => {
    try {
        let where = {
            auth: {
                [Op.eq]: 0,
            },
        };

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

        const hashtag = await db.Hashtag.findOne({
            where: { tagName: decodeURIComponent(req.params.tag)},
            attributes: ['id'],
        });

        // console.log('hashtag ? : ', JSON.stringify(hashtag));
        // console.log('backend lastId value : ', req.query.lastId);
        // console.log('where : ', where);
        // console.log('hahtag 궁금국윽ㅁ : ', JSON.stringify(hashtag.getPosts()));
        const hashtagPosts = await hashtag.getPosts({
                where,
                include: [{
                    model: db.Hashtag,
                    attributes: ['id', 'tagName'],
                }, {
                    model: db.Image,
                    attributes: ['id', 'src'],
                }, {
                    model: db.User,
                    attributes: ['id', 'userNick'],
                }, {
                    model: db.User,
                    through: 'Like',
                    as: 'Likers',
                    attributes: ['id'],
                }],
                order: [['createdAt', 'DESC']],
                limit: parseInt(req.query.limit, 10),
        });
        // console.log('hashtagPosts value : ', JSON.stringify(hashtagPosts));

        res.status(200).json(hashtagPosts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;