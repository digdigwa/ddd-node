const CryptoJS = require('crypto-js')
const sha256 = require('crypto-js/sha256')

const KEY = 'digdigdigvip'
/**
 * 加密
 */
const encrypt = (word) => {
    var key = CryptoJS.enc.Utf8.parse(KEY)
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}
/**
 * 解密
 */
const decrypt = (word) => {
    var key = CryptoJS.enc.Utf8.parse(KEY)
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * 密码生成工具类
 * @param {*} salt
 * @param {*} password
 */
function generatePassword (salt, password) {
    return sha256(salt + password).toString()
}

// const tools = require('../../../common/tools')
// console.log(tools.dateFormat('yyyy-MM-dd hh:mm:ss', new Date()))

module.exports = {
    encrypt,
    decrypt,
    generatePassword
}
