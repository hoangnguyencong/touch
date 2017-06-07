import express from 'express'

import {
  authenticate
} from '../auth'

const postRoute = express.Router({mergeParams: true})

import {
  postResourceValidation
} from '../validations/posts'

import {
  getPosts,
  getPost
} from '../services/userPosts'

postRoute
  .route('/:postId')
  .all(authenticate(), postResourceValidation)
  /**
   * @api {get} /users/:userId/posts/:postId Get post by id and user id
   * @apiGroup Posts
   * @apiParam {Number} userId User id
   * @apiParam {Number} id Post id
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Number} id Post id
   * @apiSuccess {String} title Post title
   * @apiSuccess {String} content Post content
   * @apiSuccess {Object} owner Post owner
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'title': 'some title',
   *    'content': 'some content',
   *    'owner': {
   *      'id': 2
   *      'name': 'hoang'
   *      'email': 'hoang.email.com'
   *    }
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getPost)

postRoute
  .route('/')
  .all(authenticate())
  /**
   * @api {get} /users/:userId:/posts Get posts by user id
   * @apiGroup Posts
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Object[]} array of posts
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  [{
   *    'id': 1,
   *    'title': 'some title',
   *    'content': 'some content',
   *    'owner': {
   *      'id': 2
   *      'name': 'hoang'
   *      'email': 'hoang.email.com'
   *    }
   *  }]
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getPosts)

export default postRoute
