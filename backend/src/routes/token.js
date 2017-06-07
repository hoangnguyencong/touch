import express from 'express'

import {
  getTokenValidation
} from '../validations/token'

import {
  getToken
} from '../services/token'

const tokenRoute = express.Router()

  /**
   * @api {post} /token Authentication Token
   * @apiGroup Credentials
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiParamExample {json} Input
   *  {
   *    'email': 'hoang.nguyencong@asnet.com.vn',
   *    'password': 'hoang123'
   *  }
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {'token': 'example.token'}
   * @apiErrorExample {json} Authentication error
   *  HTTP/1.1 401 Unauthorized
   */
  tokenRoute
    .route('/token')
    .post(getTokenValidation, getToken)

export default tokenRoute
