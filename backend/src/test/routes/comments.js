import jwt from 'jwt-simple'

describe('Routes: posts/:postId/comments/:commentId', () => {
  const Users = models.Users
  const Posts = models.Posts
  const Comments = models.Comments
  const sequelize = models.sequelize
  const jwtSecret = config.jwtSecret
  let hoangId
  let token
  let anotherToken

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

  let newComment = {
    content: 'new content'
  }

  let comments = [
    {content: 'comment'},
    {content: 'another comment'}
  ]

  let likeCount

  let postId

  let commentId
  let commentUpdate = {
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

              anotherToken = jwt.encode({id: hoangId}, jwtSecret)

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

                      Posts.findOne({
                        where: {
                          ownerId: hoangId
                        }
                      })
                      .then((rs) => {
                        postId = rs.dataValues.id

                        comments.map((comment) => {
                          comment.ownerId = hoangitId
                          comment.postId = postId

                          return comment
                        })

                        Comments
                          .destroy({where: {}})
                          .then(() => {
                            Comments
                              .bulkCreate(comments)
                              .then(() => {
                                Comments.findOne({
                                  where: {
                                    postId,
                                    ownerId: hoangitId
                                  }
                                })
                                .then((rs) => {

                                  commentId = rs.dataValues.id
                                  done()
                                })
                              })
                          })

                      })
                    })
                })
            })
      })
  })

  describe('GET /posts/:postId/comments', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        request
          .get(apiPrefix + '/posts/' + postId + '/comments')
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

      it('Should return an array comments from post', (done) => {
        const {
          body
        } = response

        expect(body.length).to.equal(comments.length)
        done()
      })

      it('The comment must contains specify fields', (done) => {
        const {
          body
        } = response

        expect(body[0]).to.include.keys('id', 'owner', 'content', 'createdAt', 'updatedAt')
        done()
      })

      it('The comment must has owner', (done) => {
        const {
          body
        } = response

        expect(body[0].owner).to.include.keys('id', 'email', 'name', 'avatar')
        done()
      })

    })

  })

  describe('Post /posts/:postId/comments', () => {
    describe('Status 201', () => {
      beforeEach((done) => {
        request
          .post(apiPrefix + '/posts/' + postId + '/comments')
          .set('Authorization', `JWT ${token}`)
          .send(newComment)
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

        expect(body).to.include.keys('content', 'createdAt', 'updatedAt', 'ownerId')
        done()
      })

    })

    describe('Status 400', () => {

      it('Should return correct status when post content is invalid', (done) => {
        const invalidComments = [
          {content: 1},
          {content: null},
          {content: {}},
          {content: undefined}
        ]

        let count = 0

        invalidComments.forEach((invalidComment) => {
          request
            .post(apiPrefix + '/posts/' + postId + '/comments')
            .set('Authorization', `JWT ${token}`)
            .send(invalidComment)
            .end((error, res) => {
              count++
              expect(res.status).to.equal(400)

              if (count === invalidComments.length) {
                done()
              }
            })
        })
      })

    })

  })

  describe('GET /posts/:postId/comments/:commentId', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        request
          .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
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

      it('Should return correct fields', (done) => {
        const {
          body
        } = response

        expect(body).to.include.keys('content', 'owner', 'createdAt', 'updatedAt', 'postId')
        done()
      })

    })

    describe('Status 404', () => {

      beforeEach((done) => {
        request
          .get(apiPrefix + '/posts/' + postId + '/comments/-1')
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

  describe('DELETE /posts/:postId/comments/:commentId', () => {

    describe('Status 404', () => {

      beforeEach((done) => {
        request
          .delete(apiPrefix + '/posts/' + postId + '/comments/-1')
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

    describe('Status 204', () => {

      beforeEach((done) => {
        request
          .delete(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
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

  })

  describe('PUT /post/:postId/comments/:commentId', () => {
    describe('Status 200', () => {

      beforeEach((done) => {
        request
          .put(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
          .send(commentUpdate)
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

      it('Data should be updated', (done) => {
        const {
          body
        } = response

        expect(body.content).to.equal(commentUpdate.content)

        done()
      })

    })

    describe('Status 403', () => {

      beforeEach((done) => {
        request
          .put(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
          .send(commentUpdate)
          .set('Authorization', `JWT ${anotherToken}`)
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

    })

  })

  describe('PUT /post/:postId/comments/commentId/action', () => {

    describe('Like comment', () => {
      describe('Status 204', () => {
        beforeEach((done) => {
          request
            .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              likeCount = res.body.likeCount

              request
                .put(apiPrefix + '/posts/' + postId + '/comments/' + commentId + '/action')
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
            .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.liked).to.be.true
              done()
            })
        })

        it('Should increase like count', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
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
            .put(apiPrefix + '/posts/' + postId + '/comments/' + commentId + '/action')
            .send({
              action: 'like'
            })
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              request
                .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
                .set('Authorization', `JWT ${token}`)
                .end((error, res) => {
                  likeCount = res.body.likeCount

                  request
                    .put(apiPrefix + '/posts/' + postId + '/comments/' + commentId + '/action')
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
            .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.liked).to.be.false
              done()
            })
        })

        it('Should descrease like count', (done) => {
          request
            .get(apiPrefix + '/posts/' + postId + '/comments/' + commentId)
            .set('Authorization', `JWT ${token}`)
            .end((error, res) => {
              expect(res.body.likeCount).to.equal(likeCount - 1)
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
            .put(apiPrefix + '/posts/' + postId + '/comments/' + commentId + '/action')
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
