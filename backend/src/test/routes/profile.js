 import jwt from 'jwt-simple'

 describe('Routes: token', () => {
  const {
    Users,
    sequelize
  } = models

  const {
    jwtSecret
  } = config

  let token
  let response
  const updatedData = {
    email: 'updated.email.com',
    name: 'updated name'
  }

  const newUser = {
    name: 'Hoang Nguyen',
    email: 'Hoang.NguyenCong@asnet.com.vn',
    password: 'hoang123'
  }

  let newUserId

  before((done) => {
    sequelize.sync().done(() => {
      Users
      .destroy({where: {}})
        .then(() => {
          Users
            .create(newUser)
            .then((user) => {
              newUserId = user.id
              token = jwt.encode({id: newUserId}, jwtSecret)

              done()
            })
        })
    })
  })

  describe('GET /profile', () => {
    describe('Status 200', () => {
      beforeEach((done) => {
        request
          .get(apiPrefix + '/profile')
          .set('Authorization', `JWT ${token}`)
          .end((error, res) => {
            response = res
            done()
          })
      })

      it('Return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(200)
        done()
      })

      it('Return user with specify fields', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('id', 'name', 'email')

        done()
      })

      it('Return correct user based token', (done) => {
        const {
          body: {
            email,
            name
          }
        } = response

        expect(name).to.equal(newUser.name)
        expect(email).to.equal(newUser.email)

        done()
      })

    })
  })

  describe('PUT /profile', () => {
    describe('Status 200', () => {
      beforeEach((done) => {
        request
          .put(apiPrefix + '/profile')
          .set('Authorization', `JWT ${token}`)
          .send(updatedData)
          .end((error, res) => {
            response = res
            done()
          })
      })

      it('Return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(200)
        done()
      })

      it('Return updated user', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('id', 'name', 'email')
        expect(newUserId).to.equal(body.id)
        expect(updatedData.email).to.equal(body.email)
        expect(updatedData.name).to.equal(body.name)
        done()
      })

    })
  })
})
