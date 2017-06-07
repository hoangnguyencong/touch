import _ from 'lodash'
import models from '../models'

import {
  serializeComment,
  serializeComments
} from '../utils/commentSerialize'

const {
  Users,
  Comments,
  Posts,
  Photos
} = models

const getComment = (req, res) => {
  Comments
    .findOne({
      where: {
        postId: req.params.postId,
        id: req.params.commentId
      },
      include: [{
        model: Users,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'avatarId'],
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

      result.dataValues = serializeComment(result.dataValues, req.user.id)

      res.json(result)
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })

  }

  const updateComment = (req, res) => {

    Comments
      .update({content: req.body.content}, {
        where: {
          postId: req.params.postId,
          id: req.params.commentId
        },
        returning: true,
        plain: true

      })
      .then((result) => {
        if (!result && result[1]) {
          res.status(404)
        }

        res.json(result[1].dataValues)
      })
      .catch(error => {
        res.status(412).json({msg: error.message})
      })

  }

  const deleteComment = (req, res) => {
    Comments
      .findOne({
        where: {
          postId: req.params.postId,
          id: req.params.commentId
        }
      })
      .then((comment) => {
        if (!comment) {
          return res.sendStatus(404)
        }

        comment
          .destroy()
          .then(() => {
            res.sendStatus(204)
          })
      })
      .catch(error => {
        res.status(412).json({msg: error.message})
      })

  }

  const commentAction = (req, res) => {
    Comments
      .findOne({
        where: {
          id: req.params.commentId,
          postId: req.params.postId
        }
      })
      .then((comment) => {
        const userId = req.user.id

        if (!comment) {
          return res.sendStatus(404)
        }

        switch (req.body.action) {
          case 'like':
            comment.likes.push(userId)
            comment.likes = _.uniq(comment.likes)

            break

          case 'unlike':
            comment.likes = comment.likes.filter((likedId) => {
              return likedId !== userId
            })

            break
        }

        comment
          .save()
          .then((rs) => {
            res.sendStatus(204)
          })
          .catch(error => {
            res.status(412).json({msg: error.message})
          })
      })
  }

  const getComments = (req, res) => {
    Comments
      .findAll({
        where: {
          postId: req.params.postId
        },
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

        result = serializeComments(result, req.user.id)
        res.json(result)
      })
      .catch(error => {
        res.status(412).json({msg: error.message})
      })
  }

  const createComment = (req, res) => {
    const comment = {
      postId: req.params.postId,
      content: req.body.content,
      ownerId: req.user.id
    }

    Comments
      .create(comment)
      .then((result) => {
        res.status(201).json(result.get())
      })
      .catch(error => {
        res.status(412).json({msg: error.message})
      })
  }

  export default {
    getComment,
    updateComment,
    deleteComment,
    commentAction,
    getComments,
    createComment
  }
