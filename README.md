## 介绍
家政前端Node开发模版

## 使用说明

```
// 安装初始化工具
npm i jz-cli -g
// 初始化
jz-cli init
```
根据提示操作即可。


## 其它

1. 修改`src/config/base.js`中的端口以及根路径
2. 首次部署时创建offline、online分支即可初始化线下与线上环境。初始化成功后，即可删掉分支
3. 开发模版为了避免代码合并到master触发构建，注释掉了`.gitlab-ci.yml`中的prod相关配置，实际应用需放开
