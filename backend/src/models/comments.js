module.exports = (sequelize, DataType) => {
  const Comments = sequelize.define('Comments', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    likes: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: []
    }
  }, {
    classMethods: {
      associate: (models) => {
        Comments.belongsTo(models.Posts, {
          as: 'post',
          foreignKey : 'postId'
        })
        Comments.belongsTo(models.Users, {
          as: 'owner',
          foreignKey : 'ownerId'
        })
      }
    }
  })

  return Comments
}
