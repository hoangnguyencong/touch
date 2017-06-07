module.exports = (sequelize, DataType) => {
  const Posts = sequelize.define('Posts', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
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
    },
    bookmarks: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: []
    }
  }, {
    classMethods: {
      associate: (models) => {
        Posts.belongsTo(models.Users, {
          as: 'owner',
          foreignKey : 'ownerId'
        })
        Posts.hasMany(models.Comments)
      }
    }
  })

  return Posts
}
