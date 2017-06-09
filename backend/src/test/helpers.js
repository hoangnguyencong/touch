import supertest from 'supertest'
import chai from 'chai'
import app from '../index.js'
import models from '../models'
import config from '../libs/constants'

global.config = config
global.apiPrefix = '/api/v1'
global.models = models
global.app = app
global.request = supertest(app)
global.expect = chai.expect

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
