const router = require('express').Router()

const { Op } = require('sequelize')

const { User, Blog } = require('../models')
const ReadingList = require('../models/readinglist')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res) => {
  const new_username = req.body.new_username
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })
  if (user) {
    user.username = new_username
    await user.save()
    res.json(user)
  } else {
    return res.status(401).json({ error: 'invalid username' })
  }
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    let temp
    if (req.query.read === 'true') temp = true
    else if (req.query.read === 'false') temp = false
    else {
      return res.status(401).json({ error: 'invalid read condition' })
    }
    where.read = {
      [Op.eq]: temp,
    }
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'listed_blogs',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'read'],
          as: 'reading_list',
          where,
        },
      },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
