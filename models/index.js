const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

//Blog.sync({ alter: true })
//User.sync({ alter: true })
User.belongsToMany(Blog, { through: ReadingList, as: 'listed_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_listed' })

module.exports = {
  Blog,
  User,
}
