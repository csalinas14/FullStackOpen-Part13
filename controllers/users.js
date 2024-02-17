const router = require('express').Router()

const { User, Blog } = require('../models')

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

module.exports = router