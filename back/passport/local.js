const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password',
    }, async (userId, password, done) => {
        try {
            const user = await db.User.findOne({ where: { userId }});
            if(!user) {
                //첫번쨰 인자: 성공, 두번째 인자: 실패, 세번쨰 인자: 실패 사유
                return done(null, false, { reason: '아이디 또는 비밀번호를 다시 확인하세요.'});
            }
            const result = await bcrypt.compare(password, user.password);
            if(result) {
                return done(null, user);
            }
            return done(null, false, { reason: '아이디 또는 비밀번호를 다시 확인하세요.'});
        } catch (e) {
            console.error(e);
            return done(e);
        }
    }));
};