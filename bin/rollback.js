const shell = require('shelljs')
const colors = require('colors')

const { echo, exec, exit } = shell
const success = colors.green
const error = colors.red
const info = colors.blue

const [ commitId, branch ] = JSON.parse(process.env.npm_config_argv).remain

const date = new Date()

const currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

if (!commitId) {
  echo(error('请添加commitId'))
  exit(1)
}

if (!branch) {
  echo(error('请添加要回滚的分支'))
  exit(1)
}

const startLog = () => {
  echo(info('========================开始回滚========================'))
  echo(info(`回滚commitId: ${commitId}`))
}

const endLog = () => {
  echo(info(`回滚完成，请及时去${branch}分支上验证`))
  echo(info('========================回滚完成========================'))
}

const logInfo = (cshell, msg, isExit = true) => {
  if (cshell.code === 0) {
    echo(success(`${msg}成功`))
  } else {
    echo(error(`Error: ${msg}失败`))
    if (isExit) {
      exit(1)
    }
  }
}

const checkoutBranch = () => {
  logInfo(exec(`git checkout ${branch}`), `切换目标分支${branch}`)
}

const pullFromBranch = () => {
  logInfo(exec(`git pull origin ${branch}`), `下载最新代码${branch}`)
}

const bakMaster = () => {
  const backBranchName = `bak_${branch}_${currentDate}_${date.getTime()}`
  logInfo(exec(`git push origin ${branch}:${backBranchName}`), `添加备份分支${backBranchName}`)
}

const resetToCommitId = () => {
  logInfo(exec(`git reset --hard ${commitId}`), `切换到${commitId}`)
  logInfo(exec(`git push -f origin ${branch}`), `提交给远程${branch}`)
}

startLog()
checkoutBranch()
pullFromBranch()
bakMaster()
resetToCommitId()
endLog()
