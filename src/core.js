// https://github.com/octokit/octokit.js
const core = require("@actions/core");
const setBody = require('./body')
const { getDate, getDayDiff } = require('./date')
// console.log(setBody);return false

const {
  Octokit
} = require("octokit");

module.exports = async function createIssueAction({ owner, repo }) {
  try {
    const token = core.getInput("token");
    const octokit = new Octokit({
      auth: token,
    });
    let issue_number = 0,
      allLables = {}, // {label.description(github user login): label}
      labelsName = []
    // 0、获取所有labels
    const labelsData = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner,
      repo,
      per_page: 100,
      page: 1
    })
    if (labelsData && labelsData.data) {
      labelsData.data.forEach((label) => {
        allLables[label.description] = label
      })
      console.log('所有的label名单', Object.keys(allLables));
    }
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
      issue_number = (issueInfo.data[0] && issueInfo.data[0].number) || 0
      console.log('获取最近一条 issues_number', issue_number);
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
      let completeUser = comments.data.map((comment) => comment.user.login),
        all = new Set(Object.keys(allLables))
      console.log(all, Object.keys(allLables), completeUser);
      completeUser = new Set(completeUser)
      unCompleteUser = [...new Set([...all].filter(user => !completeUser.has(user)))]
      labelsName = unCompleteUser.map(user => allLables[user].name)
      console.log(unCompleteUser, labelsName);
    }

    /**
     * 3、批量添加labels（未打卡）
     * octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/labels", {})
     */
    if(labelsName.length > 0) {
      const addLabel = await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels: labelsName
      })
      console.log('添加labels', addLabel)
    }


    /**
     * 4、创建issue https://github.com/octokit/octokit.js#rest-api
     */
    
    octokit.rest.issues.create({
      owner,
      repo,
      title: `【每日打卡】${getDate()} 第${getDayDiff()}天`,
      body: setBody(),
    }).then((res) => {
      console.log("issue创建成功啦！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('issue创建失败', err);
    })
  } catch (err) {
    console.log('end-error', err);
  }
}