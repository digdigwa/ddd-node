const errorHandler  = require('./errorHandler')

module.exports = (app) => {
    // 异常监听 404状态码
    app.use(errorHandler())
}
