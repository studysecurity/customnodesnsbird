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

        const searchPosts = await db.Post.findAll({
            where,
            include: [{
                model: db.Hashtag,
                where: { tagName: decodeURIComponent(req.params.tag) },
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10),
        });

        // console.log('searchPosts id 값 : ', searchPosts.map(v => v.id));
        const posts = searchPosts.map(v => v.id);
        const hashtagPosts = await db.Post.findAll({
            where: {
                id : {
                    [Op.in]: posts,
                },
            },

            include: [{
                model: db.Hashtag,
                attributes: ['id', 'tagName'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                attributes: ['id', 'userNick'],
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
        });

        // console.log('hashtag 값 : ', JSON.stringify(hashtagPosts));
        res.status(200).json(hashtagPosts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;