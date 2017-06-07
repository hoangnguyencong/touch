import models from '../models'

const {
  Users,
  Posts
} = models

const getPost = (req, res) => {
  Posts
    .findOne({
      where: {
        ownerId: req.params.userId,
        id: req.params.postId
      },
      include: [{
        model: Users,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]

    })
    .then((result) => {
      res.json(result)
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })
}

const getPosts = (req, res) => {
  Posts
    .findAll({
      where: {
        ownerId: req.params.userId
      },
      include: [{
        model: Users,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]

    })
    .then((result) => {
      res.json(result)
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })
}

export {
  getPost,
  getPosts
}
