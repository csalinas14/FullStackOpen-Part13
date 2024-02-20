const router = require('express').Router()

const { tokenExtractor } = require('../utils/middleware')

const { User } = require('../models')
const ReadingList = require('../models/readinglist')

router.post('/', async (req, res) => {
  console.log(req.body)
  const readingList = await ReadingList.create(req.body)
  return res.json(readingList)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  console.log(req.body)
  const readingListBlog = await ReadingList.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id)
  console.log(readingListBlog)
  console.log(user)
  if (
    (req.body.read === true || req.body.read === false) &&
    user &&
    readingListBlog &&
    user.id === readingListBlog.userId
  ) {
    readingListBlog.read = req.body.read
    await readingListBlog.save()
    res.json(readingListBlog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
