const axios      = require('axios')
const { logger, httpTraceLog } = require('./log/traceLog')
const { errorLog, infoLog } = httpTraceLog()

/**
 * 封装HTTP相关请求
 */
class HTTP {
    constructor () {
        this.intercept()
    }

    /**
   * 请求拦截器，拦截HTTP请求并打印日志
   */
    intercept () {
    // 全局axios返回值拦截
        axios.interceptors.response.use(response => {
            try {
                infoLog(response.config, response)
            } catch (error) {
                logger.error(`【拦截器】：日志打印报错, ${error}`)
            }
            return response
        }, error => {
            try {
                errorLog(error.config)
            } catch (error) {
                logger.error(`【拦截器】：日志打印报错, ${error}`)
            }
            return Promise.reject(error)
        })
    }

    /**
   * get请求
   * @param url
   * @param config
   * @returns {*}
   */
    get (url, config) {
        return axios.get(url, config)
    }

    /**
   * post请求
   * @param url
   * @param data
   * @param config
   * @returns {*}
   */
    post (url, data, config) {
        return axios.post(url, data, config)
    }

    /**
   * 直接调用axios对象
   * @param config
   * @returns {*}
   */
    axios (config) {
        return axios(config)
    }
}

module.exports = new HTTP()
