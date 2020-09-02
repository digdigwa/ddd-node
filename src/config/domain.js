let host            = ''      // Node中间层域名
let rdHostPage      = ''      // 跳转页面的域名，接老页面（外网访问）
let rdHostApi       = ''      // 后端接口域名（内网访问）
let uspApi          = ''      // 小程序 订单接口地址
let bargainApi      = ''      // 砍价接口内网域名
let cPassportApi    = ''      // C端登录接口域名
switch (process.env.JZ_ENV) {
    case 'a':
        // FE73 环境 对应RD73 环境
        host = '//jz73.djtest.cn'
        rdHostPage = '//tjzt73.djtest.cn'
        rdHostApi = 'http://baojie-betaa.djtest.cn'
        uspApi = 'http://usp-betaa.djtest.cn'
        bargainApi = 'https://integralsys-betaa.djtest.cn'
        cPassportApi = 'https://passport-betaa.djtest.cn'
        break
    case 'b':
        // FE74 环境 对应RD74 B环境
        host = '//jz74.djtest.cn'
        rdHostPage = '//tjzt74.djtest.cn'
        rdHostApi = 'http://baojie-betab.djtest.cn'
        uspApi = 'http://usp-betab.djtest.cn'
        bargainApi = 'https://integralsys-betab.djtest.cn'
        cPassportApi = 'https://passport-betab.djtest.cn'
        break
    case 'c':
        // FE75 环境 对应RD75 环境
        host = '//jz75.djtest.cn'
        rdHostPage = '//tjzt75.djtest.cn'
        rdHostApi = 'http://baojie-betac.djtest.cn'
        uspApi = 'http://usp-betac.djtest.cn'
        bargainApi = 'https://integralsys-betac.djtest.cn'
        cPassportApi = 'https://passport-betac.djtest.cn'
        break
    case 'box':
        // 沙箱环境
        host = '//jzbox45.djtest.cn'
        rdHostPage = '//tjzt8.djtest.cn'
        rdHostApi = 'http://baojie-alprod.djtest.cn'
        uspApi = 'https://usp-mirror.djtest.cn'
        bargainApi = 'https://integralsys-alprod.djtest.cn'
        cPassportApi = 'https://passport-box.djtest.cn'
        break
    case 'prod':
        // 线上环境
        host = '//jiazheng.daojia.com'
        rdHostPage = '//jzt.daojia.com'
        rdHostApi = 'http://baojie.web.djdns.cn'
        uspApi = 'http://clean-usp.web.djdns.cn'
        bargainApi = 'http://integralsys.web.djdns.cn'
        cPassportApi = 'https://user.daojia.com'    // 外网使用：user.daojia.com
        break
    default:
        // 默认-线上环境
        host = '//jiazheng.daojia.com'
        rdHostPage = '//jzt.daojia.com'
        rdHostApi = 'http://baojie.web.djdns.cn'
        uspApi = 'http://clean-usp.web.djdns.cn'
        bargainApi = 'http://integralsys.web.djdns.cn'
        cPassportApi = 'https://user.daojia.com'
}

console.log('host:' + host)
console.log('rdHostPage:' + rdHostPage)
console.log('rdHostApi:' + rdHostApi)
console.log('uspApi:' + uspApi)
console.log('bargainApi:' + bargainApi)
console.log('cPassportApi:' + cPassportApi)

module.exports = {
    host,
    rdHostPage,
    rdHostApi,
    uspApi,
    bargainApi,
    cPassportApi
}
