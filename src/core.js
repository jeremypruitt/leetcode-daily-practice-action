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
    const issue_number = 0,
      labelsName = []
    /**
     * 1、获取最近一条 issues
     */
    const issueInfo = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner,
      repo,
      per_page: 1,
      page: 1
    })
    if (issueInfo && issueInfo.data) {
      issue_number = issueInfo[0]?.number || 0
    } else {
      throw new Error('获取最近一条issues 失败')
    }
    /**
     * 2、获取最近一条 issue 的所有 comments，求差级得到未打卡名单
     * 示例地址：https://api.github.com/repos/xingorg1/leetcode-daily-practice-action/issues/15/comments
     */
    const comments = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner,
      repo,
      issue_number,
      per_page: 100,
      page: 1
    })
    if (comments && comments.data) {
      labelsName = comments.data.map((comment) => comment.user.login)
    } else {
      throw new Error('获取最近一条 issue 的所有 comments 失败了')
    }
    // 3、获取所有labels
    //  /repos/{owner}/{repo}/labels
    octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner,
      repo,
      per_page: 100,
      page: 1
    }).then((res) => {
      console.log("labels成功！！", JSON.stringify(res.data));
      // res.data.map(() => {

      // })
    }).catch((err) => {
      console.log('labels创建失败', err);
    })
    /**
     * 3、批量添加labels（未打卡）
     */
    // octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/labels", {})
    // const addLabel = await octokit.rest.issues.addLabels({
    //   owner,
    //   repo,
    //   issue_number: 15,
    //   labels: ['小石头', 'good first issue']
    // })


    /**
     * 4、创建issue https://github.com/octokit/octokit.js#rest-api
     */
    /*
    octokit.rest.issues.create({
      owner,
      repo,
      title: `【每日打卡】${getDate()} 第${getDayDiff()}天`,
      body: getBody(),
    }).then((res) => {
      console.log("issue创建成功啦！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('issue创建失败', err);
    }) */
  } catch (err) {
    console.log('end-error', err);
  }
}