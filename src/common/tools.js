class Tools {
    /**
     * 获取环境变量
     * @returns {string}
     */
    getENV () {
        return ['a', 'b', 'c'].includes(process.env.JZ_ENV) ? 'test' : process.env.JZ_ENV
    }

    /**
     * 是否为生产环境判断
     * @returns {boolean}
     */
    isProdENV () {
        return this.getENV() === 'prod'
    }

    getUUID () {
        let uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
        return uid.replace(/-/g, '')
    }
    // 日期格式化
    dateFormat (fmt, date) {
        let o = {
            'M+': date.getMonth() + 1,                    // 月份
            'd+': date.getDate(),                         // 日
            'h+': date.getHours(),                        // 小时
            'm+': date.getMinutes(),                      // 分
            's+': date.getSeconds(),                      // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3),  // 季度
            'S': date.getMilliseconds()                   // 毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
}

module.exports = new Tools()
