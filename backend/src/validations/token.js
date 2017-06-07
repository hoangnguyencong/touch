import util from 'util'

const getTokenValidation = (req, res, next) => {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail()
  req.checkBody('password', 'Password must be string and not null').notEmpty().isString()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

export default {
  getTokenValidation
}
