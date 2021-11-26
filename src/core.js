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
      per_page: 1,
    });

    // iterate through each response
    for await (const { data: issuesData } of iteratorData) {
      for (const issueItem of issuesData) {
        console.log("IssueItem #%d: %s", issueItem.number, issueItem.title, issueItem.labels);
        // console.log("【每条issue详细信息】", JSON.stringify(issueItem));
        let labelsData = issueItem.labels.map((label) => {
          return label.name
        })
        console.log(labelsData);
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
                  title,
                  labels {
                    name
                  },
                  number,
                  milestone {
                    title
                  },
                  comments {
                    user {
                      login
                    }
                  }
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

    // 批量添加labels https://github.com/xingorg1/leetcode-daily-practice-action/labels
    // octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/labels", {})
    octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: 15,
      labels: ['小石头', 'good first issue']
    }).then((res) => {
      console.log("批量添加labels！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('批量添加labels失败', err);
    })

    // 获取最近一条issue的所有comments
    // https://api.github.com/repos/xingorg1/leetcode-daily-practice-action/issues/15/comments
    octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: "octocat",
      repo: "hello-world",
      issue_number: 15,
      per_page: 100,
      page: 1
    }).then((res) => {
      console.log("所有的comments！！", res && JSON.stringify(res.data));
    }).catch((err) => {
      console.log('所有的comments失败', err);
    })
    /**
     * await octokit.request('GET /repos/{owner}/{repo}/issues/comments/{comment_id}', {
        owner: 'octocat',
        repo: 'hello-world',
        comment_id: 42
      })
     */

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