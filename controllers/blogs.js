const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { SECRET } = require('../utils/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    }

    /*
    where.title = {
      [Op.iLike]: `%${req.query.search}%`,
    }
    where.author = {
      [Op.iLike]: `%${req.query.search}%`,
    }
    */
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  console.log(JSON.stringify(blogs, null, 2))

  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  console.log(req.body)
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  return res.json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  //const blog = await Blog.findByPk(req.params.id)
  //console.log(blog)
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog && req.blog.userId == user.id) await req.blog.destroy()
  else return res.status(401).json({ error: 'Incorrect user' })
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.body.likes) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
