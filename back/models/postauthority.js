module.exports = (sequelize, DataTypes) => {

    const PostAuthority = sequelize.define('PostAuthority', {
        auth: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글 저장
    });

    PostAuthority.associate = (db) => {
        db.PostAuthority.belongsTo(db.Post);
    };

    return PostAuthority;
};