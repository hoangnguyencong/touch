import bcryptjs from 'bcryptjs'

module.exports = (sequelize, DataType) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  }, {
    // timestamps: true,
    // paranoid: true,
    hooks: {
      beforeCreate: user => {
        const salt = bcryptjs.genSaltSync()

        user.password = bcryptjs.hashSync(user.password, salt)
      }
    },
    classMethods: {
      associate: (models) => {
        Users.hasMany(models.Posts)
        Users.belongsTo(models.Photos, {
          as: 'avatar',
          foreignKey : 'avatarId'
        })
      },
      isPassword: (encodedPassword, password) => {
        return bcryptjs.compareSync(password, encodedPassword)
      }
    }
  })

  return Users
}
