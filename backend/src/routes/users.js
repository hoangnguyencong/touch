import express from 'express'
import postRoute from './userPosts'

import {
  authenticate
} from '../auth'

import {
  userValidation,
  createUserValidation,
  updateUserValidation,
  getUsersValidation
} from '../validations/users'

import {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser
} from '../services/users'

const userRoute = express.Router()

userRoute
  .use('/:userId/posts', postRoute)

userRoute
  .route('/')
  /**
   * @api {get} /users Get users by page
   * @apiGroup Users
   * @apiParam {Number} perPage items perpage
   * @apiParam {Number} page page
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Object[]} rows array of users
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'rows': [{
   *    'id': 1,
   *    'name': 'hoang',
   *    'email': 'hoang.nguyencong@asnet.com.vn'
   *    }]
   *  }
   *
   *  HTTP/1.1 206 partial content
   *  {
   *    'rows': [{
   *    'id': 1,
   *    'name': 'hoang',
   *    'email': 'hoang.nguyencong@asnet.com.vn'
   *    }]
   *  }
   *
   * HTTP/1.1 204 No content
   *
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(authenticate(), getUsersValidation, getUsers)

  /**
   * @api {post} /users Create user
   * @apiGroup Users
   * @apiParam {String} name User name
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccess {String} updatedAt updated at
   * @apiSuccess {String} createdAt created at
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'name': 'hoang',
   *    'email': 'hoang.nguyencong@asnet.com.vn',
   *    'updatedAt': 2017-04-27T07:52:23.274Z,
   *    'createdAt': 2017-04-27T07:52:23.274Z
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .post(createUserValidation, createUser)

userRoute
  .route('/:userId')
  .all(authenticate(), userValidation)
  /**
   * @api {get} /users/:userId Get user data
   * @apiGroup Users
   * @apiParam {Number} id User id
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'name': 'hoang',
   *    'email': 'hoang.nguyencong@asnet.com.vn'
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .get(getUser)

  /**
   * @api {delete} /users/:userId Delete current user
   * @apiGroup Users
   * @apiParam {Number} userId User id
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 204 No Content
   * @apiErrorExample {json} Delete error
   *  HTTP/1.1 412 Precondition Failed
   */
  .delete(deleteUser)

  /**
   * @api {put} /users/:userId Update user
   * @apiGroup Users
   * @apiParam {String} [name] User name
   * @apiParam {String} [email] User email
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccess {String} updatedAt updated at
   * @apiSuccess {String} createdAt created at
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'name': 'hoang',
   *    'email': 'hoang.nguyencong@asnet.com.vn',
   *    'updatedAt': 2017-04-27T07:52:23.274Z,
   *    'createdAt': 2017-04-27T07:52:23.274Z
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .put(updateUserValidation, updateUser)

export default express.Router().use('/users', userRoute)
