const logger = require('./logger')
const jwt = require('jsonwebtoken')

const { SECRET } = require('../utils/config')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  console.log('hello')
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    //console.log(error)
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

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

module.exports = {
  errorHandler,
  tokenExtractor,
}
