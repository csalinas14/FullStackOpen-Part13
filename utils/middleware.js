const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  console.log('hello')
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    console.log(error.name)
    return res
      .status(400)
      .send({ error: 'Validation isEmail on username failed' })
  }

  next(error)
}

module.exports = {
  errorHandler,
}
