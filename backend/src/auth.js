import passport from 'passport'
import {Strategy, ExtractJwt} from 'passport-jwt'

import config from './libs/constants'

import models from './models'

const {
  Users
} = models

const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
}

const strategy = new Strategy(params, (payload, done) => {
  Users.findById(payload.id)
    .then(user => {
      if (user) {
        return done(null, {
          id: user.id,
          email: user.email
        })
      }

      return done(null, false)
    })
    .catch(error => done(error, null))

})

passport.use(strategy)

export default {
  initialize: () => {
    return passport.initialize()
  },

  authenticate: () => {
    return passport.authenticate('jwt', config.jwtSession)
  }
}
