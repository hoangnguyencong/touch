import util from 'util'

const userValidation = (req, res, next) => {
  req.checkParams('userId', 'userId must be integer and not null').notEmpty().isInt()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const getUsersValidation = (req, res, next) => {
  req.checkQuery('perPage', 'perPage must be integer').optional().isInt()
  req.checkQuery('page', 'page must be integer').optional().isInt()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const createUserValidation = (req, res, next) => {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail()
  req.checkBody('name', 'Name must be string and not null').notEmpty().isString()
  req.checkBody('password', 'Password must be string and not null').notEmpty().isString()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const updateUserValidation = (req, res, next) => {
  req.checkBody('name', 'Name must be string and not null').notEmpty().optional().isString()
  req.checkBody('email', 'Email is invalid').notEmpty().optional().isEmail()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
      return
    }

    next()
  })
}

const userActionValidation = (req, res, next) => {
  req.checkBody('action', 'Invalid actions').notEmpty().isIn(['like', 'unlike', 'bookmark', 'unbookmark'])

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

export default {
  userValidation,
  createUserValidation,
  updateUserValidation,
  getUsersValidation
}
