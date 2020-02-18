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
        console.log('req.body.content 값 : ',req.body.content);
        console.log('req.body.postVisibility 값 : ',req.body.postVisibility);
        console.log('req.body.tags 값 : ', JSON.stringify(req.body.tags));

        res.status(200).send('');
    } catch(e) {
        console.error(e);
        next(e);
    }
});



module.exports = router;