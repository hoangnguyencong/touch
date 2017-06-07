 describe('Routes: token', () => {
  const {
    Users,
    sequelize
  } = models

  const newUser = {
    name: 'Hoang Nguyen',
    email: 'Hoang.NguyenCong@asnet.com.vn',
    password: 'hoang123'
  }

  before((done) => {
    sequelize.sync().done(() => {
      Users
      .destroy({where: {}})
        .then(() => {
          Users.create(newUser)
        })
        .then(() => {
          done()
        })
    })
  })

  describe('POST /token', () => {
    describe('Status 200', () => {
      it('Returns authenticated user token', (done) => {
        request
          .post(apiPrefix + '/token')
          .send(newUser)
          .expect(200)
          .end((error, res) => {
            expect(res.body).to.includes.keys('token')
            done(error)
          })
      })
    })

    describe('Status 401', () => {
      it('Throw error if password is incorrect', (done) => {
        request
          .post(apiPrefix + '/token')
          .send({
            email: 'Hoang.NguyenCong@asnet.com.vn',
            password: 'hoang1234'
          })
          .expect(401)
          .end((error, res) => {
            done(error)
          })
      })

      it('Throw error if email not exist', (done) => {
        request
          .post(apiPrefix + '/token')
          .send({
            email: 'wrongemail@asnet.com.vn',
            password: 'hoang1234'
          })
          .expect(401)
          .end((error, res) => {
            done(error)
          })
      })

      it('Throw error if email and password are blank', (done) => {
        request
          .post(apiPrefix + '/token')
          .send({
            email: '',
            password: ''
          })
          .expect(400)
          .end((error, res) => {
            done(error)
          })
      })
    })
  })
})
