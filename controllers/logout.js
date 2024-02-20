const { tokenExtractor, checkActiveSession } = require('../utils/middleware')

const router = require('express').Router()
const { Session } = require('../models')

router.delete('/', tokenExtractor, checkActiveSession, async (req, res) => {
  await Session.destroy({
    where: {
      user_id: req.decodedToken.id,
    },
  })
  res.status(204).end()
})

module.exports = router
