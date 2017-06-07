import util from 'util'

const postResourceValidation = (req, res, next) => {
  req.checkParams('postId', 'postId must be integer and not null').notEmpty().isInt()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const getPostsValidation = (req, res, next) => {
  req.checkQuery('perPage', 'perPage must be integer').optional().isInt()
  req.checkQuery('page', 'page must be integer').optional().isInt()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const createPostValidation = (req, res, next) => {
  req.checkBody('title', 'Invalid post title').notEmpty().isString()
  req.checkBody('content', 'Invalid post content').notEmpty().isString()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

const updatePostValidation = (req, res, next) => {
  req.checkBody('title', 'Invalid post title').notEmpty().optional().isString()
  req.checkBody('content', 'Invalid post title').notEmpty().optional().isString()

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
      return
    }

    next()
  })
}

const postActionValidation = (req, res, next) => {
  req.checkBody('action', 'Invalid actions').notEmpty().isIn(['like', 'unlike', 'bookmark', 'unbookmark'])

  req.getValidationResult().then((result) => {

    if (!result.isEmpty()) {
      return res.status(400).json({msg: 'Validation errors: ' + util.inspect(result.array())})
    }

    next()
  })
}

export default {
  postResourceValidation,
  createPostValidation,
  getPostsValidation,
  updatePostValidation,
  postActionValidation
}
