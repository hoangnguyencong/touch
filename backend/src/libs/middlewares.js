import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import expressValidator from 'express-validator'
import compression from 'compression'

import logger from './logger.js'
import APP_CONSTANT from './constants'
import models from '../models'

import {
  initialize
} from '../auth'

const {
  Users
} = models

module.exports = app => {

  app.set('port', APP_CONSTANT.PORT)

  app.set('json spaces', APP_CONSTANT.JSON_SPACE)

  app.use(morgan('common', {
    stream: {
      write: (message) => {
        logger.info(message)
      }
    }
  }))

  app.use(initialize())

  app.use(compression())

  app.use(bodyParser.json())

  app.use(expressValidator({
    customValidators: {
      isString: (value) => {
        return typeof value === 'string'
      },
      isArray: (value) => {
          return Array.isArray(value);
      },
      isEmailAvailable: (value) => {
        return new Promise((resolve, reject) => {
          Users.findOne({where: {email: value}}, (err, user) => {
            if (err) {
              throw err
            }

            if(!user) {
              resolve()
            } else {
              reject()
            }
          })
        })
      }
    }
  }))

  app.use((req, res, next) => {
    delete req.body.id
    next()
  })

  app.use(express.static('static'))

}
