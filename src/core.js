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

    // 迭代所有issue https://github.com/octokit/octokit.js#pagination
    const iteratorData = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
      owner,
      repo,
      per_page: 2,
    });

    // iterate through each response
    for await (const { data: issues } of iteratorData) {
      for (const issue of issues) {
        console.log("Issue #%d: %s", issue.number, issue.title);
        console.log("【每条issue详细信息】", JSON.stringify(issue));
      }
    }

    // 获取最近的几条issue https://github.com/octokit/octokit.js#graphql-api-queries
    octokit.graphql(
      `
        query lastIssues($owner: String!, $repo: String!, $num: Int = 1) {
          repository(owner: $owner, name: $repo) {
            issues(last: $num) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      `,
      {
        owner,
        repo,
      }
    ).then((res) => {
      console.log("lastIssues！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('lastIssues获取失败', err);
    })

    /* // 创建issue https://github.com/octokit/octokit.js#rest-api
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