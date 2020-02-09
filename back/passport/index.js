const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    //참고 사이트
    //https://github.com/jaredhanson/passport
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.User.findOne({
                where: { id },
            });
            return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });

    local();
};




// 프론트에서 서버로는 cookie만 보내요
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
// id: 3이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser 가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱