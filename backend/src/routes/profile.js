import express from 'express'

import {
  authenticate
} from '../auth'

import {
  getProfile,
  updateProfile,
  updateAvatar,
  upload
} from '../services/profile'

const profileRoute = express.Router()

profileRoute
  .route('/profile')
  .all(authenticate())
  /**
   * @api {get} /profile Get current user profile
   * @apiGroup Profile
   *
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {json} success
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
  .get(getProfile)
  /**
   * @api {put} /profile Update current user profile
   * @apiGroup Profile
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {json} success
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'id': 1,
   *    'name': 'new name',
   *    'email': 'new.email.com'
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  .put(updateProfile)

  /**
   * @api {post} /profile/upload_avatar Update profile photo
   * @apiGroup Profile
   * @apiHeaderExample {json} Header
   *  {"Authorization": "JWT example.token"}
   * @apiSuccess {json} success
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    'url': 'some/url'
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  profileRoute
    .route('/profile/upload_avatar')
    .all(authenticate())

    .post(upload.single('avatar'), updateAvatar)

export default profileRoute
