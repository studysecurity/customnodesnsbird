module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //테이블명은 users
        userNick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        userPhone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post, { as: 'Posts' });
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'followerId'});
    }

    return User;
}