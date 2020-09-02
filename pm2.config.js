
const PROJECT_NAME  = 'node-ddd'
const POST_DEPLOY   = 'source ~/.bash_profile && npm i && pm2 startOrRestart pm2.config.js'
const PATH = '/home/digdigdig/node-ddd'
// const REPO = 'git@git.daojia-inc.com:fe-jz/jz-node-template.git'

module.exports = {
    'apps': [{
        'name': `${PROJECT_NAME}`,
        'script': 'src/index.js',
        'exec_mode': 'cluster',
        'instances': 0,
        'max_memory_restart': '1G',
        'autorestart': true,
        'node_args': [],
        'output': `/opt/log/${PROJECT_NAME}/output.log`,
        'error': `/opt/log/${PROJECT_NAME}/error.log`,
        'merge_logs': true,
        'log_date_format': 'YYYY-MM-DD HH:mm:ss.SSS',
        'env': {
            'NODE_ENV': 'production',
            'JZ_ENV': 'prod'
        },
        'env_prod': {
            'NODE_ENV': 'production',
            'JZ_ENV': 'prod'
        },
        'env_box': {
            'NODE_ENV': 'production',
            'JZ_ENV': 'box'
        },
        'env_test73': {
            'NODE_ENV': 'production',
            'JZ_ENV': 'a'
        },
        'env_test74': {
            'NODE_ENV': 'production',
            'JZ_ENV': 'b'
        },
        'env_test75': {
            'NODE_ENV': 'production',
            'JZ_ENV': 'c'
        }
    }],
    'deploy': {
        // 线下环境初始化
        'offline': {
            'user': 'root',
            'host': ['49.233.209.31'],
            // 'ref': 'origin/master',
            // 'repo': REPO,
            'path': PATH,
            'post-deploy': `${POST_DEPLOY} --env prod`
        },
        // 线上环境
        'prod': {
            'user': 'root',
            'host': ['49.233.209.31'],
            // 'ref': 'origin/master',
            // 'repo': REPO,
            'path': PATH,
            'post-deploy': `${POST_DEPLOY} --env prod`
        }
    }
}
