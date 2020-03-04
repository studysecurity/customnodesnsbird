const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/:tag', isLoggedIn, async (req, res, next) => {
    try {
        const searchPosts = await db.Post.findAll({
            include: [{
                model: db.Hashtag,
                attributes: ['id', 'tagName'],
                through: {
                    attributes: ['HashtagId'],
                },
                where: { tagName: decodeURIComponent(req.params.tag) },
            }, {
                model: db.User,
                attributes: ['id', 'userNick'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(searchPosts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;