const http = require('./http')

/**
 * 实现请求透传
 */
class Proxy {
    /**
   * 目前不支持websocket
   * @param url       转发URL
   * @param extParams 扩展参数
   * @param ctx
   * @returns {Promise<void>}
   */
    async launch ({ url, extParams }, ctx) {
        let method = ctx.method
        // 兼容GET与POST，带上cookie
        let headers = ctx.headers
        // 去除host项，避免报404错误
        delete headers.host
        let options = {
            method: method,
            url: url,
            headers: headers,
            params: Object.assign(ctx.query, extParams)
        }
        // post请求才传请求体，避免get请求携带请求体后导致后端报错
        if (method.toLowerCase() === 'post') {
            options.data = Object.assign(ctx.request.body, extParams)
        }
        let result = await http.axios(options)
        // 设置返回头信息以及数据
        ctx.set(result.headers)
        ctx.body = result.data
    }
}

module.exports = new Proxy()
