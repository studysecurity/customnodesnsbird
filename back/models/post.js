module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //테이블명은 posts
        content: {
            type: DataTypes.TEXT, //매우 긴 글
            allowNull: false, //널값 허용하지 않음
        },
    }, {
        charset: 'utf8mb4', // 한글 + 이모티콘
        collate: 'utf8mb4_general_ci',
    });

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); 
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.hasOne(db.PostAuthority);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers'});
    };

    return Post;
};

// 1:N 구조에서는 N이 1의(부모) 의 컬럼을 하나 가지고 있어야 조회가 가능함.