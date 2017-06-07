import jwt from 'jwt-simple'

describe('Routes: posts', () => {
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
  let newPost = {
    title: 'title',
    content: 'new content'
  }
  let likeCount
  let bookmarkCount

  let postId
  let postUpdate = {
    title: 'update title',
    content: 'update content'
  }

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

  describe('GET /posts', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        request
          .get(apiPrefix + '/posts?page=0&perPage=' + posts.length)
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

      it('Should return an array posts from users', (done) => {
        const {
          body
        } = response

        expect(body.rows.length).to.equal(posts.length)
        done()
      })

      it('The post must contains specify fields', (done) => {
        const {
          body
        } = response

        expect(body.rows[0]).to.include.keys('id', 'owner', 'content', 'title', 'createdAt', 'updatedAt')
        done()
      })

      it('The post must has owner', (done) => {
        const {
          body
        } = response

        expect(body.rows[0].owner).to.include.keys('id', 'email', 'name', 'avatar')
        done()
      })

    })

    describe('Status 204', () => {

      beforeEach((done) => {
        request
          .get(apiPrefix + '/posts?page=1&perPage=' + posts.length)
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
          .get(apiPrefix + '/posts?page=0&perPage=' + (posts.length + 1))
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

  describe('Post /posts', () => {
    describe('Status 201', () => {

      beforeEach((done) => {
        request
          .post(apiPrefix + '/posts')
          .set('Authorization', `JWT ${token}`)
          .send(newPost)
          .end((error, res) => {
            response = res

            done()
          })
      })

      it('Should return correct status', (done) => {
        const {
          status
        } = response

        expect(status).to.equal(201)
        done()
      })

      it('Should contains correctly fields', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('title', 'content')
        done()
      })

    })

    describe('Status 400', () => {

      it('Should return correct status when post title or content is invalid', (done) => {
        const invalidPosts = [
          {content: 'some content'},
          {title: 'some title'},
          {content: '1', title: null},
          {content: '1', title: 1},
          {content: 1, title: '1'},
          {content: null, title: null},
          {content: {}, title: '1'},
          {content: {}, title: {}}
        ]

        let count = 0

        invalidPosts.forEach((invalidPost) => {
          request
            .post(apiPrefix + '/posts')
            .set('Authorization', `JWT ${token}`)
            .send({
              title: ''
            })
            .end((error, res) => {
              count++
              expect(res.status).to.equal(400)

              if (count === invalidPosts.length) {
                done()
              }
            })
        })
      })

    })

  })

  describe('GET /posts/:postId', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        Posts.findOne({
          where: {
            ownerId: hoangId
          }
        })
        .then((rs) => {
          postId = rs.dataValues.id

          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              response = res

              done()
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

      it('Should return correct fields', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('title', 'content', 'owner')
        done()
      })

    })

    describe('Status 404', () => {

      beforeEach((done) => {
        request
            .get(apiPrefix + '/posts/-1')
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

        expect(status).to.equal(404)
        done()
      })

    })

  })

  describe('PUT /post/:postId', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        Posts.findOne({
          where: {
            ownerId: hoangitId
          }
        })
        .then((rs) => {
          postId = rs.dataValues.id

          request
            .put(apiPrefix + '/posts/' + postId)
            .send(postUpdate)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              response = res

              done()
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

      it('Data should be updated', (done) => {
        const {
          body
        } = response

        expect(body.title).to.equal(postUpdate.title)
        expect(body.content).to.equal(postUpdate.content)

        done()
      })

    })

    describe('Status 400', () => {

      beforeEach((done) => {
        Posts.findOne({
          where: {
            ownerId: hoangitId
          }
        })
        .then((rs) => {
          postId = rs.dataValues.id

          request
            .put(apiPrefix + '/posts/' + postId)
            .send(postUpdate)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              response = res

              done()
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

      it('Data should be updated', (done) => {
        const {
          body
        } = response

        expect(body.title).to.equal(postUpdate.title)
        expect(body.content).to.equal(postUpdate.content)

        done()
      })

    })

  })

  describe('PUT /post/:postId/action', () => {
    beforeEach((done) => {
      Posts.findOne({
        where: {
          ownerId: hoangitId
        }
      })
      .then((rs) => {
        postId = rs.dataValues.id
        done()
      })
    })

    describe('Like post', () => {
      describe('Status 204', () => {
        beforeEach((done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              likeCount = res.body.likeCount

              request
                .put(apiPrefix + '/posts/' + postId + '/action')
                .send({
                  action: 'like'
                })
                .set('Authorization', `JWT ${token}`)
                .end((error, res) => {
                  response = res
                  done()
                })
            })

        })

        it('Should return correct status', (done) => {
          expect(response.status).to.equal(204)
          done()
        })

        it('Should update liked to true', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.liked).to.be.true
              done()
            })
        })

        it('Should increase like count', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.likeCount).to.equal(likeCount + 1)
              done()
            })
        })
      })
    })

    describe('Unlike post', () => {
      describe('Status 204', () => {
        beforeEach((done) => {

          request
            .put(apiPrefix + '/posts/' + postId + '/action')
            .send({
              action: 'like'
            })
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              request
                .get(apiPrefix + '/posts/' + postId)
                .set('Authorization', `JWT ${token}`)
                .end((error, res) => {
                  likeCount = res.body.likeCount

                  request
                    .put(apiPrefix + '/posts/' + postId + '/action')
                    .send({
                      action: 'unlike'
                    })
                    .set('Authorization', `JWT ${token}`)
                    .end((error, res) => {
                      response = res
                      done()
                    })
                })
            })
        })

        it('Should return correct status', (done) => {
          expect(response.status).to.equal(204)
          done()
        })

        it('Should update liked to false', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.liked).to.be.false
              done()
            })
        })

        it('Should descrease like count', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.likeCount).to.equal(likeCount - 1)
              done()
            })
        })
      })
    })

    describe('Bookmark post', () => {
      describe('Status 204', () => {
        beforeEach((done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              bookmarkCount = res.body.bookmarkCount

              request
                .put(apiPrefix + '/posts/' + postId + '/action')
                .send({
                  action: 'bookmark'
                })
                .set('Authorization', `JWT ${token}`)
                .end((error, res) => {
                  response = res
                  done()
                })
            })

        })

        it('Should return correct status', (done) => {
          expect(response.status).to.equal(204)
          done()
        })

        it('Should update bookmarked to true', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.bookmarked).to.be.true
              done()
            })
        })

        it('Should increase bookmark count', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.bookmarkCount).to.equal(bookmarkCount + 1)
              done()
            })
        })
      })
    })

    describe('Unbookmark post', () => {
      describe('Status 204', () => {
        beforeEach((done) => {

          request
            .put(apiPrefix + '/posts/' + postId + '/action')
            .send({
              action: 'bookmark'
            })
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              request
                .get(apiPrefix + '/posts/' + postId)
                .set('Authorization', `JWT ${token}`)
                .end((error, res) => {
                  bookmarkCount = res.body.bookmarkCount

                  request
                    .put(apiPrefix + '/posts/' + postId + '/action')
                    .send({
                      action: 'unbookmark'
                    })
                    .set('Authorization', `JWT ${token}`)
                    .end((error, res) => {
                      response = res
                      done()
                    })
                })
            })
        })

        it('Should return correct status', (done) => {
          expect(response.status).to.equal(204)
          done()
        })

        it('Should update bookmarked to false', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.bookmarked).to.be.false
              done()
            })
        })

        it('Should descrease bookmark count', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.bookmarkCount).to.equal(bookmarkCount - 1)
              done()
            })
        })
      })
    })

    describe('Invalid actions', () => {
      it('Should return status 400', (done) => {
        const invalidActions = [
          {
            action: null
          }, {
            action: 1
          }, {
            action: undefined
          }, {
            action: 'test'
          }
        ]

        let count = 0

        invalidActions.forEach((invalidAction) => {
          request
            .put(apiPrefix + '/posts/' + postId + '/action')
            .send(invalidAction)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              count++

              expect(res.status).to.equal(400)

              if (count === invalidActions.length) {
                done()
              }
            })
        })

      })
    })

  })

})
