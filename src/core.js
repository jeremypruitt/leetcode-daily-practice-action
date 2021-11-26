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
    const labelsData = octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner,
      repo,
      per_page: 100,
      page: 1
    })
    console.log(labelsData);
    if (labelsData && labelsData.data) {
      labelsData.data.forEach((label) => {
        allLables[label.description] = label
      })
      console.log('所有的label名单', allLables);
    } else {
      throw new Error('0、获取所有labels 失败')
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
    } else {
      throw new Error('1、获取最近一条issues 失败')
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
      let completeUser = comments.data.map((comment) => comment.user.login)
      console.log(all, Object.keys(allLables), completeUser);
      all = new Set(Object.keys(allLables))
      completeUser = new Set(completeUser)
      unCompleteUser = [...new Set([...all].filter(user => !completeUser.has(user)))]
      labelsName = unCompleteUser.map(user => allLables[user].name)
      console.log(unCompleteUser, labelsName);
    } else {
      throw new Error('2、获取最近一条 issue 的所有 comments 失败了')
    }

    /**
     * 3、批量添加labels（未打卡）
     */
    // octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/labels", {})
    // const addLabel = await octokit.rest.issues.addLabels({
    //   owner,
    //   repo,
    //   issue_number: 15,
    //   labels: labelsName
    // })
    // console.log('添加labels', addLabel)


    /**
     * 4、创建issue https://github.com/octokit/octokit.js#rest-api
     */
    /*
    octokit.rest.issues.create({
      owner,
      repo,
      title: `【每日打卡】${getDate()} 第${getDayDiff()}天`,
      body: setBody(),
    }).then((res) => {
      console.log("issue创建成功啦！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('issue创建失败', err);
    }) */
  } catch (err) {
    console.log('end-error', err);
  }
}