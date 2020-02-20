const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

//이미지 업로드
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            //uploads 폴더에 저장
            done(null, 'uploads');
        },
        filename(req, file, done) {
         const ext = path.extname(file.originalname);
         const basename = path.basename(file.originalname, ext); //파일이름.png, ext===png, basename===파일이름
         done(null, basename + new Date().valueOf() + ext); //첫번째 인자: 서버 에러, 두번째 인자: 성공시
        },
    }),
    limits: { fileSize: 20*1024*1024},
});

router.post('/images', upload.array('image'), (req, res) => {
    // console.log('이거머냐 : ',req.files);
    res.json(req.files.map(v => v.filename));
});

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
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id, //association db.Post.belongsTo(db.User); 와 연관있음.
        });

        //해쉬태그 디비에 저장
        const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
            where: { tagName: tag.toLowerCase() },
        })));
        // console.log('post의 result 값 : ', result);
        await newPost.addHashtags(result.map(r => r[0]));

        //게시물 공개여부 권한 설정 디비에 저장
        if (parseInt(req.body.postVisibility) > 0) { //1(팔로우만 공개), 2(나만 공개)만 저장
            // console.log('권한 설정이 0 초과임');
            const auth = await db.PostAuthority.create({ 
                auth: req.body.postVisibility,
                PostId: newPost.id,
            });
            // console.log('post의 auth 값 : ', auth);
        } 
        // else {
        //     console.log('권한 설정이 0임');
        // }

        //이미지 디비에 저장
        if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
            if (Array.isArray(req.body.image)) {
                const images = await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image });
                }));
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
            }],
        }); 

        res.status(200).json(fullPost);
    } catch(e) {
        console.error(e);
        next(e);
    }
});



module.exports = router;