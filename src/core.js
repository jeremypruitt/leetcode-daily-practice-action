// https://github.com/octokit/octokit.js
const core = require("@actions/core");
const getBody = require('./body')
const { getDate, getDayDiff } = require('./date')
// console.log(getBody);return false

const {
  Octokit
} = require("octokit");

module.exports = async function createIssueAction({ owner, repo }) {
  try {
    const token = core.getInput("token");
    const octokit = new Octokit({
      auth: token,
    });

    // 创建issue https://github.com/octokit/octokit.js#rest-api
    octokit.rest.issues.create({
      owner,
      repo,
      title: `【每日打卡】${getDate()} 第${getDayDiff()}天`,
      body: getBody(),
    }).then((res) => {
      console.log("issue创建成功啦！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('issue创建失败', err);
    })
  } catch (err) {
    console.log('end-error', err);
  }
}