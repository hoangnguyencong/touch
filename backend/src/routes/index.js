import express from 'express'
import userRoutes from './users'
import tokenRoute from './token'

import postRoutes from './posts'

import profileRoute from './profile'

module.exports = app => {
  /**
   * @api {get} / API Status
   * @apiGroup Status
   * @apiSuccess {String} status API Status's message
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {"status": "Touch API"}
   *
   */
  app.get('/', (req, res) => {
    res.json({status: 'Touch API'})
  })

  app.use('/api/v1',
    userRoutes,
    tokenRoute,
    profileRoute,
    postRoutes
  )
}
