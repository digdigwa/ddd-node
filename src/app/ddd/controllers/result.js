function result (data) {
    return Object.assign({
        status: 0,
        message: 'success',
        data: ''
    }, data || {})
}

module.exports = {
    result
}
