import express from 'express'

import {
  authenticate
} from '../auth'

import {
  commentResourceValidation,
  updateCommentValidation,
  commentActionValidation,
  createCommentValidation
} from '../validations/comments'

import {
  getComment,
  updateComment,
  deleteComment,
  commentAction,
  getComments,
  createComment
} from '../services/comments'

const commentRoute = express.Router({mergeParams: true})

commentRoute
  .route('/:commentId')
  .all(authenticate(), commentResourceValidation)

  /**
   * @api {get} /comments/:postId/comments/commentId Get comment by postId and commentId
   * @apiGroup Comments
   * @apiParam {Number} postId Post id
   * @apiParam {Number} commentId Comment id
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Number} id Comment id
   * @apiSuccess {String} content Comment content
   * @apiSuccess {Object} owner Comment owner
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'content': 'some content',
   *    'owner': {
   *      'id': 2
   *      'name': 'hoang'
   *      'email': 'hoang.email.com',
   *      'avatar': {
   *        'url': '/some/url'
   *      }
   *    }
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getComment)
  /**
   * @api {put} /comments/:postId/comments/commentId Update comment
   * @apiGroup Comments
   * @apiParam {String} content Post content
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Number} id Comment id
   * @apiSuccess {String} content Comment content
   * @apiSuccess {Number} ownerId Comment owner id
   * @apiSuccess {Number} postId Post id
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'content': 'some content',
   *    'ownerId': 1,
   *    'postId': 1
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .put(updateCommentValidation, updateComment)
  /**
   * @api {delete} /comments/:postId/comments/commentId Delete comment
   * @apiGroup Comments
   * @apiParam {Number} postId Post id
   * @apiParam {Number} id Comment id
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Object} success
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 204 No content
   *  {}
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .delete(deleteComment)


commentRoute
  .route('/:commentId/action')
  .all(authenticate(), commentResourceValidation)
  /**
   * @api {put} comments/:commentId Like/unlike a comment
   * @apiGroup Comments
   *
   * @apiParam {String} action Comment action
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 204 No content
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .put(commentActionValidation, commentAction)

commentRoute
  .route('/')
  .all(authenticate())
  /**
   * @api {get} /posts/:postId:/comments Get comments
   * @apiGroup Comments
   * @apiSuccess {Object[]} array of comments
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  [{
   *    'id': 1,
   *    'content': 'some content',
   *    'ownerId': id,
   *     ...
   *  }]
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getComments)

  /**
   * @api {post} /posts/:postId:/comments Create comment
   * @apiGroup Comments
   * @apiParam {String} content Post conent
   * @apiParam {Number} postId post id
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Object} Comment
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  [{
   *    'id': 1,
   *    'content': 'some content',
   *    'ownerId': 2,
   *    'postId': 2
   *  }]
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   *
   */
  .post(createCommentValidation, createComment)

export default commentRoute
