import jwt from 'jwt-simple'

describe('Routes: users', () => {
  const Users = models.Users
  const Posts = models.Posts
  const sequelize = models.sequelize
  const jwtSecret = config.jwtSecret
  let hoangId
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
    hoangit
  ]

  let posts
  let hoangPosts
  let hoangitPosts
  let hoangitId
  let response

  before((done) => {
    sequelize.sync().done(() => {
      done()
    })
  })

  beforeEach((done) => {
    hoangPosts = [
      {
        title: 'post title',
        content: 'post content'
      },
      {
        title: 'another post title',
        content: 'another post content'
      }
    ]

    hoangitPosts = [
      {
        title: 'post title from hoangit',
        content: 'post content from hoangit'
      }
    ]

    Users
      .destroy({where: {}})
      .then(() => {
        Users
          .create(hoangit)
          .then((res) => {
            hoangitId = res.dataValues.id

            token = jwt.encode({id: hoangitId}, jwtSecret)

            hoangitPosts.map((post) => {
              post.ownerId = post.ownerId || hoangitId

              return post
            })
          })

        Users
          .create(hoang)
          .then((res) => {

            hoangId = res.dataValues.id
            hoangPosts.map((post) => {
              post.ownerId = post.ownerId || hoangId

              return post
            })

            posts = [
              ...hoangPosts,
              ...hoangitPosts
            ]

            Posts
              .destroy({where: {}})
              .then(() => {
                Posts
                  .bulkCreate(posts)
                  .then((res) => {
                    done()
                  })
              })
          })
      })
  })

  describe('GET /users/:userId/posts', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        request
          .get(apiPrefix + '/users/' + hoangId + '/posts')
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

      it('Should return an array posts of user', (done) => {
        const {
          body
        } = response

        expect(body.length).to.equal(hoangPosts.length)
        done()
      })

      it('The post must contains specify fields', (done) => {
        const {
          body
        } = response

        expect(body[0]).to.include.keys('id', 'owner', 'content', 'title', 'createdAt', 'updatedAt')
        done()
      })

      it('The post must has owner', (done) => {
        const {
          body
        } = response

        expect(body[0].owner).to.include.keys('id', 'email', 'name')
        done()
      })

    })
  })


  describe('GET /users/:userId/posts/:postId', () => {
    describe('Status 200', () => {
      beforeEach((done) => {
        request
          .get(apiPrefix + '/users/' + hoangId + '/posts')
          .set('Authorization', `JWT ${token}`)
          .end((error, res) => {
            request
              .get(apiPrefix + '/users/' + hoangId + '/posts/' + res.body[0].id)
              .set('Authorization', `JWT ${token}`)
              .end((error, res) => {
                response = res
                done(error)
              })
          })
      })

      it('Should return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(200)

        done()
      })

      it('Should return post of user', (done) => {
        const {
          body
        } = response

        expect(body.owner.id).to.equal(hoangId)

        done()
      })

      it('Should return post with valid fileds', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('id', 'owner', 'content', 'title', 'createdAt', 'updatedAt')

        done()
      })

    })

  })

})
