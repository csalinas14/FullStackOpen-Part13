const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('*')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
  })

  console.log(JSON.stringify(authors, null, 2))

  res.json(authors)
})

module.exports = router
