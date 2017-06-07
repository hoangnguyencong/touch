import https from 'https'
import fs from 'fs'

import {
  sequelize
} from '../models'

module.exports = app => {
  if (process.env.NODE_ENV !== 'test') {

    sequelize.sync().done(() => {

      app
        .listen(app.get('port'), () => {
          console.log(`NTask API - Port ${app.get('port')}`)
        })

    })
  }
}
