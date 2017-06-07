import express from 'express'

import {
  authenticate
} from '../auth'

import {
  postResourceValidation,
  getPostsValidation,
  createPostValidation,
  updatePostValidation,
  postActionValidation
} from '../validations/posts'

import commentsRoute from './comments'

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  postAction
} from '../services/posts'

const postRoute = express.Router()

postRoute
  .use('/:postId/comments', postResourceValidation, commentsRoute)

postRoute
  .route('/')
  .all(authenticate())
  /**
   * @api {get} /posts Get posts by page
   * @apiGroup Posts
   * @apiParam {Number} perPage items perpage
   * @apiParam {Number} page page
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Object[]} rows array of posts
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'rows': [{
   *    'id': 1,
   *    'title': 'post title',
   *    'content': 'post content',
   *    'owner': {
   *      'id': 1,
   *      'name': 'some name',
   *      'email': 'some.mail@gmail.com'
   *
   *      'avatar': {
   *        'id': 1,
   *        'url': 'some/url'
   *      }
   *     }
   *    }]
   *  }
   *
   * HTTP/1.1 206 partial content
   *  {
   *    'rows': [{
   *    'id': 1,
   *    'title': 'post title',
   *    'content': 'post content',
   *    'owner': {
   *      'id': 1,
   *      'name': 'some name',
   *      'email': 'some.mail@gmail.com'
   *
   *      'avatar': {
   *        'id': 1,
   *        'url': 'some/url'
   *      }
   *     }
   *    }]
   *  }
   *
   * HTTP/1.1 204 No content
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getPostsValidation, getPosts)

  /**
   * @api {post} /posts create post
   * @apiGroup Posts
   * @apiParam {String} title post title
   * @apiParam {String} content post content
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
   *      'email': 'hoang.email.com',
   *      'avatar': {
   *        'id': 1
   *        'url': 'some/url'
   *       }
   *    }
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .post(createPostValidation, createPost)

postRoute
  .route('/:postId')
  .all(authenticate(), postResourceValidation)
  /**
   * @api {get} posts/:postId Get post by id
   * @apiGroup Posts
   *
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
   *      'email': 'hoang.email.com',
   *      'avatar': {
   *        'id': 1
   *        'url': 'some/url'
   *       }
   *    }
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getPost)
  /**
   * @api {put} posts/:postId Update post
   * @apiGroup Posts
   * @apiParam {Number} id Post id
   * @apiParam {String} title Post title
   * @apiParam {String} content Post content
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
   *      'email': 'hoang.email.com',
   *      'avatar': {
   *        'id': 1
   *        'url': 'some/url'
   *       }
   *    }
   *  }
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 404 Not found
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 400 Bad request
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .put(updatePostValidation, updatePost)


postRoute
  .route('/:postId/action')
  .all(authenticate(), postResourceValidation)
  /**
   * @api {put} posts/:postId Like/unlike/bookmark/unbookmark a post
   * @apiGroup Posts
   *
   * @apiParam {String} action Post action
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 204 No content
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .put(postActionValidation, postAction)

export default express.Router().use('/posts', postRoute)
