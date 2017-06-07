import util from 'util'

const commentResourceValidation = (req, res, next) => {
  req.checkParams('commentId', 'commentId must be integer and not null').notEmpty().isInt()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const updateCommentValidation = (req, res, next) => {
  req.checkBody('content', 'content must be string and not null').notEmpty().isString()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const commentActionValidation = (req, res, next) => {
  req.checkBody('action', 'Invalid actions').notEmpty().isIn(['like', 'unlike'])

    req.getValidationResult().then((result) => {

      if (!result.isEmpty()) {
        return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
      }

      next()
    })
}

const createCommentValidation = (req, res, next) => {
  req.checkBody('content', 'Content must be string and not null').notEmpty().isString()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })

}

export default {
  commentResourceValidation,
  updateCommentValidation,
  commentActionValidation,
  createCommentValidation
}
