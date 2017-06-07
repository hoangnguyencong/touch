module.exports = (sequelize, DataType) => {
  const Photos = sequelize.define('Photos', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        // Photos.belongsTo(models.Users)
      }
    }
  })

  return Photos
}
