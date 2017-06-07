import models from '../models'
import multer from 'multer'

import {
  upload_path
} from '../libs/constants'

import {
  imageFilter
} from '../utils/imageFilter'

const {
  Users,
  Photos,
  sequelize
} = models

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, upload_path)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({
  storage,
  fileFilter: imageFilter,
  // limits: {
  //   fieldSize: '2MB'
  // }
})

const getProfile = (req, res) => {
  Users.findById(req.user.id, {
    attributes: ['id', 'name', 'email']
  })
  .then(result => res.json(result))
  .catch(error => {
    res.status(412).json({msg: error.message})
  })
}

const updateProfile = (req, res) => {
  const {
    email,
    name
  } = req.body

  Users.update({
    email,
    name
  }, {
    where: {
      id: req.user.id
    },
    returning: true,
    plain: true
  })
  .then(result => res.json(result[1].dataValues))
  .catch(error => {
    res.status(412).json({msg: error.message})
  })
}

const updateAvatar = (req, res) => {
  const {
    file
  } = req

  sequelize.transaction((t) => {
    // chain all your queries here. make sure you return them.
    return Photos.create({
      url: file.path.replace('static/', '')
    }, {transaction: t})
      .then((result) => {
        return Users.update({avatarId: result.dataValues.id}, {
          where: {
            id: req.user.id
          },
          transaction: t
        })
        .catch((error) => {
          // Transaction has been rolled back
          // error is whatever rejected the promise chain returned to the transaction callback
          console.log(error)
        })

      })

  })
  .then((result) => {
    // Transaction has been committed
    // result is whatever the result of the promise chain returned to the transaction callback
    res.json({url: file.path})
  })
  .catch((error) => {
    // Transaction has been rolled back
    // error is whatever rejected the promise chain returned to the transaction callback
    res.status(412).json({msg: error.message})
  })

}

export default {
  getProfile,
  updateProfile,
  updateAvatar,
  upload
}
