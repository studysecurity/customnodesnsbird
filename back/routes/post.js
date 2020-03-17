const express = require('express');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
//aws s3
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();


//배포 여부에 따라 S3쓸지 아닐지 정함  
//AWS S3
AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

//AWS S3 업로드
const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'nodesnsbird',
        key(req, file, cb) {
            if(file.mimetype === 'image/jpeg' || 
            file.mimetype === 'image/png' || 
            file.mimetype === 'image/jpg' || 
            file.mimetype === 'image/jfif' ||
            file.mimetype === 'video/mp4' ||
            file.mimetype === 'video/mp3'){
                // console.log('확장자 맞음');
                cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
            } 
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});

//프론트에 image 경로 값 주기.
router.post('/images', upload.array('image'), (req, res) => {
    // console.log('백엔드 /images req.files 값 : ', req.files && JSON.stringify(req.files));
    // console.log('v.location 값 : ', req.files.map(v => decodeURI(v.location)));
    res.json(req.files.map(v => v.location));
});
    
//이미지 업로드
// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, done) {
//             //uploads 폴더에 저장
//             done(null, 'uploads');
//         },
//         filename(req, file, done) {
//             const ext = path.extname(file.originalname);
//             const basename = path.basename(file.originalname, ext); //파일이름.png, ext===png, basename===파일이름
//             done(null, basename + new Date().valueOf() + ext); //첫번째 인자: 서버 에러, 두번째 인자: 성공시
//         },
//     }),
//     limits: { fileSize: 20*1024*1024},
// });

// router.post('/images', upload.array('image'), (req, res) => {
//     // console.log('이거머냐 : ',req.files);
//     res.json(req.files.map(v => v.filename));
// });


//업로드한 게시물 DB에 저장
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        //값 잘 넘어오나 테스트 
        // console.log('req.body.content 값 : ',req.body.content);
        //게시물 권한 설정 0은 전체공개, 1은 팔로우만 공개, 2는 나만 공개
        // console.log('req.body.postVisibility 값 : ',req.body.postVisibility);
        //값이 "강아지,애완견" 이런식으로 태그값이 넘어옴
        // console.log('req.body.tags 값 : ', JSON.stringify(req.body.tags));

        const hashtags = req.body.tags.match(/[^",]+/gi);

        //게시물
        //0(전체 공개), 1(팔로우만 공개), 2(나만 공개)만 저장
        const newPost = await db.Post.create({
            content: req.body.content,
            auth: parseInt(req.body.postVisibility),
            UserId: req.user.id, //association db.Post.belongsTo(db.User); 와 연관있음.
        });
        // console.log('newPost 값 : ', JSON.stringify(newPost));

        //해쉬태그 디비에 저장
        const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
            where: { tagName: tag.toLowerCase() },
        })));
        // console.log('post의 result 값 : ', result);
        await newPost.addHashtags(result.map(r => r[0]));

        //이미지 디비에 저장
        if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
            if (Array.isArray(req.body.image)) {
                const images = await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image });
                }));
                // console.log('게시물 업로드 images 값 : ', JSON.stringify(images));
                await newPost.addImages(images);
            } else { //이미지를 하나만 올리면 image: 주소1
                const image = await db.Image.create({ src: req.body.image});
                await newPost.addImage(image);
            }
        }

        // console.log('post의 newPost 값 : ', newPost);
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
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
            }],
        }); 

        //전체공개 게시글만 포스트 추가시 덧붙여서 프론트에 보여주기.
        res.status(200).json(fullPost);
    } catch(e) {
        console.error(e);
        next(e);
    }
});


//게시글 삭제
router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await db.Post.destroy({ 
            where: { id: req.params.id },
        });
        await db.Image.destroy({
            where: { PostId: null },
        });
        res.send(req.params.id);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//좋아요
router.post('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        await post.addLiker(req.user.id);
        res.json({ userId: req.user.id });
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//좋아요 취소
router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        await post.removeLiker(req.user.id);
        res.json({ userId: req.user.id });
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//댓글 추가
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        // await post.addComment(newComment.id);
        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'userNick'],
            }],
        });
        return res.json(comment);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//댓글 내용 가져오기
router.get('/:id/comments', async (req, res, next) => {
    try {   
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            order: [['createdAt', 'ASC']],
            include: [{
                model: db.User,
                attributes: ['id', 'userNick'],
            }],
        });
        // console.log('comments 댓글 가져오기 값 : ',comments);
        res.json(comments);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//게시글 수정
router.post('/modify', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        //값 잘 넘어오나 테스트 
        // console.log('req.body.content 값 : ',req.body.content);
        //게시물 권한 설정 0은 전체공개, 1은 팔로우만 공개, 2는 나만 공개
        // console.log('req.body.postVisibility 값 : ',req.body.postVisibility);
        //값이 "강아지,애완견" 이런식으로 태그값이 넘어옴
        // console.log('req.body.tags 값 : ', JSON.stringify(req.body.tags));
        //수정할 게시글 아이디 값
        // console.log('req.body.postId 값 : ', req.body.postId);

        const hashtags = req.body.tags.match(/[^",]+/gi);

        //게시물 업데이트
        //0(전체 공개), 1(팔로우만 공개), 2(나만 공개)
        await db.Post.update({
            content: req.body.content,
            auth: parseInt(req.body.postVisibility),
        }, {
            where: { id: req.body.postId },
        });

        const updatePost = await db.Post.findOne({
            where: { id: req.body.postId },
        });

        //해쉬태그 디비에 저장
        const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
            where: { tagName: tag.toLowerCase() },
        })));
        // console.log('post의 result 값 : ', JSON.stringify(result));
        await updatePost.setHashtags(result.map(r => r[0]));

        //이미지 디비에 저장
        // console.log('req.body.image 값 : ', JSON.stringify(req.body.image));
        if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
            if (Array.isArray(req.body.image)) {
                const images = await Promise.all(req.body.image.map(image => db.Image.findOrCreate({ 
                        where: { 
                            src: image, 
                            PostId: req.body.postId,
                        }, 
                })));
                // console.log('게시글 수정 images 값 : ', JSON.stringify(images));
                
                await updatePost.setImages(images.map(r => r[0]));
                await db.Image.destroy({
                    where: {
                        PostId: null,
                    },
                });
                   
            } else { //이미지를 하나만 올리면 image: 주소1
                const image = await db.Image.findOrCreate({ //값이 있으면 이미지가 없으므로 생성해준 것임.
                    where: { 
                        src: req.body.image,
                        PostId: req.body.postId,
                    },
                });

                if (image[1]) { //false 면 수정된 이미지가 없음, true면 수정된 이미지가 있음
                    //수정된 이미지 외에 기존 이미지는 행을 삭제
                    await updatePost.setImages(image[0]);
                    //postId null값 인 것
                    await db.Image.destroy({
                        where: {
                            PostId: null,
                        },
                    });
                }
            }
        }

        const modifyFullPost = await db.Post.findOne({
            where: { id: req.body.postId },
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
            }],
        }); 

        res.status(200).json(modifyFullPost);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//좋아요한 게시글들 가져오기
router.get('/like', isLoggedIn, async (req, res, next) => {
    try {
        let where = {};
        //페이지네이션
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [Op.lt]: parseInt(req.query.lastId, 10),
                },
            };
        }
        // console.log('백엔드 좋아요 lastId 값 : ', req.query.lastId);
        // console.log('백엔드 좋아요 where 값 : ', where);

        const likePosts = await db.Post.findAll({
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
                where: {
                    id: {
                        [Op.eq]: req.user.id,
                    },
                },
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10),
        });

        // console.log('value value value : ', JSON.stringify(likePosts));
        res.status(200).json(likePosts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//팔로우한 게시글들 가져오기
router.get('/followPosts', isLoggedIn, async (req, res, next) => {
    try {
        const loginUser = await db.User.findOne({
            where: {
                id: req.user.id,
            },
            attributes: ['id', 'userNick'],
            include: [{
                model: db.User,
                through: 'Follow',
                as: 'Followings',
                attributes: ['id'],
            }],
        });
        // console.log('loginUser 값 : ', JSON.stringify(loginUser));

        const followings = loginUser.Followings.map(following => following.id);
        // console.log('followings 값 : ', JSON.stringify(followings));

        let where = {};
        //페이지네이션
        if (parseInt(req.query.lastId, 10)) {
            where = {
                auth: {
                    [Op.eq]: 1,
                },
                UserId: {
                    //팔로우한 사람의 정보를 가져오는 조건문
                    [Op.in]: followings,
                },
                id: {
                    [Op.lt]: parseInt(req.query.lastId, 10),
                },
            };
        } else {
            where = {
                auth: {
                    [Op.eq]: 1,
                },
                UserId: {
                    //팔로우한 사람의 정보를 가져오는 조건문
                    [Op.in]: followings,
                },
            };
        }

        const followingPosts = await db.Post.findAll({
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
        // console.log('value value value : ', JSON.stringify(followingPosts));
        res.status(200).json(followingPosts);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get('/single/:id', async (req, res, next) => {
    try {
        const singlePost = await db.Post.findOne({
            where: { id: req.params.id },
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
        });

        res.status(200).json(singlePost);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;