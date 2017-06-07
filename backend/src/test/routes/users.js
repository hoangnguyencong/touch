import jwt from 'jwt-simple'

describe('Routes: users', () => {
  const Users = models.Users
  const sequelize = models.sequelize
  const jwtSecret = config.jwtSecret
  let token

  const hoang = {
    name: 'Hoang Nguyen',
    email: 'Hoang.NguyenCong@asnet.com.vn',
    password: 'hoang123'
  }

  const hoangit = {
    name: 'Hoang Nguyen Cong',
    email: 'hoangitdct@gmail.com',
    password: 'hoang123'
  }

  const users = [
    hoang,
    hoangit,
    {
      name: 'Hoang Nguyen Cong',
      email: 'hoangitdct1@gmail.com',
      password: 'hoang123'
    },
    {
      name: 'Hoang Nguyen Cong',
      email: 'hoangitdct2@gmail.com',
      password: 'hoang123'
    }
  ]

  let response
  let newUser
  let newUserId

  before((done) => {
    sequelize.sync().done(() => {
      done()
    })
  })

  beforeEach((done) => {

    Users
      .destroy({where: {}})
      .then(() => {
        Users
          .bulkCreate(users)
          .then((res) => {
            Users
              .findOne({where: {email: hoang.email}})
              .then((user) => {
                token = jwt.encode({id: user.id}, jwtSecret)
                done()
              })
          })
      })
  })

  describe('GET /users', () => {
    describe('Status 200', () => {
      beforeEach((done) => {
        request
          .get(apiPrefix + '/users?perPage=4&page=0')
          .set('Authorization', `JWT ${token}`)
          .end((error, res) => {
            response = res
            done()
          })
      })

      it('Should return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(200)

        done()
      })

      it('Should return an array of users', (done) => {
        const {
          body
        } = response

        expect(body.rows.length).to.equal(users.length)

        done()
      })

      it('The user data must be contains specify fields', (done) => {
        const {
          body
        } = response

        const user = body.rows[0]

        expect(user).to.include.keys('name', 'id', 'email')
        expect(user).to.not.include.keys('password')

        done()
      })
    })

    describe('Status 204', () => {
      beforeEach((done) => {
        request
          .get(apiPrefix + '/users?perPage=' + users.length + '&page=1')
          .set('Authorization', `JWT ${token}`)
          .end((error, res) => {
            response = res
            done()
          })
      })

      it('Should return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(204)

        done()
      })

    })

    describe('Status 206', () => {
      beforeEach((done) => {
        request
          .get(apiPrefix + '/users?perPage=' + (users.length + 1 ) + '&page=0')
          .send({
            perPage: users.length,
            offset: 1
          })
          .set('Authorization', `JWT ${token}`)
          .end((error, res) => {
            response = res
            done()
          })
      })

      it('Should return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(206)

        done()
      })

    })

  })

  describe('DELETE /users', () => {
    describe('Status 204', () => {
      it('Delete user by id', (done) => {
        Users
          .all()
          .then((res) => {
            request
              .delete(apiPrefix + '/users/' + res[0].id)
              .set('Authorization', `JWT ${token}`)
              .expect(204)
              .end((error, res) => {
                done(error)
              })
          })
      })
    })

    describe('Status 404', () => {
      it('Delete invalid user', (done) => {
        request
          .delete(apiPrefix + '/users/' + '-1')
          .set('Authorization', `JWT ${token}`)
          .expect(204)
          .end((error, res) => {
            done(error)
          })
      })
    })
  })

  describe('POST /users', () => {
    describe('Status 201', () => {
      beforeEach((done) => {
        newUser = {
          name: 'hoang',
          email: 'hoang@gmail.com',
          password: 'hoang123'
        }

        request
          .post(apiPrefix + '/users')
          .set('Authorization', `JWT ${token}`)
          .send(newUser)
          .end((error, res) => {
            response = res

            done(error)
          })
      })

      it('Should return corect status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(201)

        done()
      })

      it('Should return a new user', (done) => {
        const {
          body: {email, name}
        } = response

        expect(email).to.equal(newUser.email)
        expect(name).to.equal(newUser.name)

        done()
      })

      it('Should return user with specify fields', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('id', 'email', 'name', 'createdAt', 'updatedAt')

        done()
      })
    })

    describe('Status 400', () => {
      it('User is invalid', (done) => {
        const invalidUsers = [
          {
            name: 1
          },
          {
            name: null
          },
          {
            name: undefined
          },
          {
            name: {}
          },
          {
            email: 1
          },
          {
            email: null
          },
          {
            email: undefined
          },
          {
            email: {}
          },
          {
            password: null
          },
          {
            email: 1,
            password: null
          },
          {
            name: null,
            email: null,
            password: null
          },
          {
            email: null,
            password: null
          }
        ]

        const invalidUsersLength = invalidUsers.length
        let count = 0

        invalidUsers.forEach((invalidUser) => {
          request
            .post(apiPrefix + '/users')
            .set('Authorization', `JWT ${token}`)
            .send(invalidUser)
            .expect(400)
            .end((error, res) => {

              ++count

              if (count === invalidUsersLength) {
                done(error)
              }

            })
        })
      })
    })
  })

  describe('PUT /users/:userId', () => {
    beforeEach((done) => {
      newUser = {
        name: 'hoang',
        email: 'hoang@hoang.com',
        password: 'hoang123'
      }

      Users
        .create(newUser)
        .then((res) => {
          newUserId = res.dataValues.id
          done()
        })
    })

    describe('Status 200', () => {
      beforeEach((done) => {
        request
          .put(apiPrefix + '/users/' + newUserId)
          .set('Authorization', `JWT ${token}`)
          .send({
            name: 'new name',
            email: 'new@email.com'
          })
          .end((error, res) => {
            response = res
            done(error)
          })
      })

      it('Should return corect status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(200)

        done()
      })

      it('Should update new infor', (done) => {
        const {
          body: {email, name}
        } = response

        expect(email).to.equal('new@email.com')
        expect(name).to.equal('new name')

        done()
      })

    })

    describe('Status 400', () => {
      it('User is invalid', (done) => {
        const invalidUsers = [
          {
            name: 1
          },
          {
            name: null
          },
          {
            name: undefined
          },
          {
            name: {}
          },
          {
            email: 1
          },
          {
            email: null
          },
          {
            email: undefined
          },
          {
            email: {}
          },
          {
            password: null
          },
          {
            email: 1,
            password: null
          },
          {
            name: null,
            email: null,
            password: null
          },
          {
            email: null,
            password: null
          }
        ]

        const invalidUsersLength = invalidUsers.length
        let count = 0

        invalidUsers.forEach((invalidUser) => {
          request
            .put(apiPrefix + '/users/' + newUserId)
            .set('Authorization', `JWT ${token}`)
            .send(invalidUser)
            .expect(400)
            .end((error, res) => {

              ++count

              if (count === invalidUsersLength) {
                done(error)
              }

            })
        })
      })
    })
  })

})
