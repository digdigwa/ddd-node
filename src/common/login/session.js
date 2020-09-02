const UID = 'd_uid'

/**
 * 用户状态记录相关
 */
const session = {
    /**
     * 设置用户ID
     * @param uid
     */
    setUid (ctx, uid) {
        ctx[UID] = uid
    },

    /**
     * 获取用户ID
     * @returns {*}
     */
    getUid (ctx) {
        return ctx[UID]
    }
}

module.exports = session
