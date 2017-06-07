import models from '../models'

const {
  Users
} = models

const PER_PAGE = 10

const getUsers = (req, res) => {
  const limit = req.query.perPage || PER_PAGE
  const offset = (parseInt(req.query.page, 10) || 0) * limit

  Users.findAndCountAll({
    attributes: ['id', 'name', 'email'],
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

    return res.status(status).json(result)
  })
  .catch(error => {
    res.status(412).json({msg: error.message})
  })
}

const createUser = (req, res) => {
  Users.create(req.body)
    .then((rs) => {
      res.status(201).json(rs.dataValues)
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })
}

const getUser = (req, res) => {
  Users
    .findById(req.params.userId)
    .then((result) => {
      res.json(result)
    })
    .catch(error => {
      res.status(412).json({msg: error.message})
    })
}

const deleteUser = (req, res) => {
  Users.destroy({
    where: {id: req.params.userId}
  })
  .then(result => res.sendStatus(204))
  .catch(error => {
    res.status(412).json({msg: error.message})
  })
}

const updateUser = (req, res) => {
  const newData = {
    name: req.body.name || null,
    email: req.body.email || null
  }

  Users.update(newData, {
    where: {id: req.params.userId},
    returning: true,
    plain: true
  })
  .then((result) => {
    res.json(result[1].dataValues)
  })
  .catch(error => {
    res.status(412).json({msg: error.message})
  })
}

export default {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser
}
