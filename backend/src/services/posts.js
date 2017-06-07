import _ from 'lodash'

import models from '../models'

import {
  serializePost,
  serializePosts
} from '../utils/postSerialize'

const {
  Posts,
  Photos,
  Users
} = models


const PER_PAGE = 10

const getPosts = (req, res) => {
  const limit = req.query.perPage || PER_PAGE
  const offset = (parseInt(req.query.page, 10) || 0) * limit

  Posts.findAndCountAll({
    include: [{
      model: Users,
      as: 'owner',
      include: [{
        model: Photos,
        as: 'avatar',
      }]
    }],
    order: 'id',
    limit,
    offset
  })
  .then((result) => {
    let status = 200

    if (limit > result.rows.length) {
      status = 206
    }

    if (!result.rows.length) {
      status = 204
    }

    result.rows = serializePosts(result.rows, req.user.id)

    return res.status(status).json(result)
  })
  .catch(error => {
    res.status(412).json({msg: error.message})
  })

}

const createPost = (req, res) => {
  const {
    body
  } = req

  const title = body.title.trim()
  const content = body.content.trim()

  const newPost = {
    title,
    content,
    ownerId: req.user.id
  }

  Posts
    .create(newPost)
    .then((result) => {
      Users
        .findById(req.user.id)
        .then((user) => {
          result.dataValues.owner = user
          res.status(201).json(result.dataValues)
        })
        .catch(error => {
          res.status(412).json({msg: error.message})
        })

    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })

}

const getPost = (req, res) => {

  Posts
    .findById(req.params.postId, {
      include: [{
        model: Users,
        as: 'owner',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: Photos,
          as: 'avatar'
        }]
      }]

    })
    .then((result) => {

      if (!result) {
        return res.sendStatus(404)
      }

      result.dataValues = serializePost(result.dataValues, req.user.id)

      res.json(result)
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })
}

const updatePost = (req, res) => {
    const {
      body
    } = req

    Posts.findOne({
      where: {
        id: req.params.postId,
        ownerId: req.user.id
      }
    })
    .then((post) => {
      const title = typeof body.title === 'string' ? body.title.trim() : title
      const content = typeof body.content === 'string' ? body.content.trim() : content

      if (!post) {
        res.sendStatus(404)
      }

      if (title) {
        post.title = title
      }

      if (content) {
        post.content = content
      }

      post
        .save({
          returning: true,
          plain: true
        })
        .then((result) => {
          res.json(result.dataValues)
        })
        .catch(error => {
          res.status(412).json({msg: error.message})
        })
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })
  }

  const postAction = (req, res) => {
    Posts
      .findById(req.params.postId)
      .then((post) => {
        const userId = req.user.id

        switch (req.body.action) {
          case 'like':
            post.likes.push(userId)
            post.likes = _.uniq(post.likes)

            break

          case 'unlike':
            post.likes = post.likes.filter((likedId) => {
              return likedId !== userId
            })

            break

          case 'bookmark':
            post.bookmarks.push(userId)
            post.bookmarks = _.uniq(post.bookmarks)

            break

          case 'unbookmark':
            post.bookmarks = post.bookmarks.filter((bookmarkedId) => {
              return bookmarkedId !== userId
            })

            break
        }

        post
          .save()
          .then((rs) => {
            res.sendStatus(204)
          })
          .catch(error => {
            res.status(412).json({msg: error.message})
          })
      })
  }

export default {
  getPosts,
  createPost,
  getPost,
  updatePost,
  postAction
}
