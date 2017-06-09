import supertest from 'supertest'
import chai from 'chai'
import app from '../index.js'
import models from '../models'
import config from '../libs/constants'
var fs = require('fs')

global.config = config
global.apiPrefix = '/api/v1'
global.models = models
global.app = app
global.request = supertest(app)
global.expect = chai.expect

process.on('exit', (code) => {
  console.log(`About to exit with code11: ${code}`);
  fs.writeFile('result/test_result', code, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  })
});
