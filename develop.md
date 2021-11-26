## dev

1. 初始化`package.json`

```js
npm init
```

2. 安装插件

```json
{
  "dependencies": {
    "@actions/core": "^1.6.0",
    "@actions/github": "^5.0.0",
    "dayjs": "^1.10.7",
    "octokit": "^1.7.0"
  },
  "devDependencies": {
    "@vercel/ncc": "^0.32.0"
  }
}
```

3. 根目录下创建`action.yml`脚本

```yml
name: 'Create Leetcode Daily Practice Issue'
description: 'automatic create daily practice issue for xingorg1/leetcodeRank'
inputs: token: description: 'github token'
required: true
runs: using: 'node12'
main: 'dist/index.js'
branding: icon: 'anchor'
color: 'yellow'
```

4. 创建任务流程`src/index.js`

```js
const core = require('@actions/core')
const { Octokit } = require('octokit')
const token = core.getInput('token')
const octokit = new Octokit({
  auth: token,
})

// octokit doing anything
// 参考文档：https://github.com/octokit/octokit.js
```

5. run build 构建脚本 【测试 dev 版本 仓库为本仓库 leetcode-daily-practice-action】

```js
ncc build src/dev.js --license licenses.txt
```

5. run build 构建脚本 【发布 release 版本 仓库名称为 leetcodeRank】

```js
ncc build src/index.js --license licenses.txt
```

## 新增人员要做的事儿
1、新人创建github账号（查看打卡规范文档）
2、新人提交力扣账号、
3、排行榜增加力扣账号
4、定花名（同微信群备注）
5、增加 label 标签 ⚠️ label的name为微信备注、label的desc为github账号
// 6、label id增加到github action流水线

## todo

- [x] 定时创建 issue
- [x] title 累计打卡天数 （从 2021-11-10 开始第一天打卡，从当前日计算两个时间的天数差距）
- [ ] 【获取前一个issue】创建新 issue 前，把上一个 issue 没有打卡的人数统计一下
- [ ] 【自动打标签】，根据打卡名单，排除已提交 issue 的人，剩下的人打成标签）
- [ ] 加入【里程碑】
- [ ] 创建失败给我【发邮件】

## 文档和API
- [OPEN API](https://www.openapis.org/)
- [Github REST API](https://docs.github.com/en/rest)
- [Github REST API - Issue相关](https://docs.github.com/en/rest/reference/issues)
- [REST API 博文](https://developer.github.com/changes/2020-04-07-expanding-rest-api-support-for-the-triage-and-maintain-roles/)
- [octokit](https://github.com/octokit/octokit.js)
- [octokit.rest 所有的API](https://github.com/octokit/plugin-rest-endpoint-methods.js/tree/master/docs)

## Error: octokit 依赖升级，语法需要修改

```bash
Run xingorg1/leetcode-daily-practice-action@1.1.0
/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:3260
        throw new Error('Parameter token or opts.auth is required');
        ^

Error: Parameter token or opts.auth is required
    at Object.getAuthString (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:3260:15)
    at Object.getOctokitOptions (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:3133:24)
    at Object.getOctokit (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:1982:39)
    at main (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:7767:26)
    at Object.897 (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:7770:3)
    at __webpack_require__ (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:24:31)
    at startup (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:43:19)
    at /home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:47:18
    at Object.<anonymous> (/home/runner/work/_actions/xingorg1/leetcode-daily-practice-action/1.1.0/dist/index.js:50:10)
    at Module._compile (internal/modules/cjs/loader.js:959:30)
```

## Error: 找不到仓库

```bash
Error:
https://api.github.com/repos/xingorg1/leetcode-daily-practice-action/issues

https://github.com/xingorg1/leetcode-daily-practice-action/issues/1
```

![](2021-11-25-18-59-16.png)
