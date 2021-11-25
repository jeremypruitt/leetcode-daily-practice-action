const core = require("@actions/core");
const github = require("@actions/github");
const dayjs = require("dayjs");

(function main() {
  const token = core.getInput("token");
  console.log('token', token)
  const octokit = github.getOctokit(token);
  console.log('octokit', octokit)

  createIssue(octokit);
})();

function createIssue(octokit) {
  octokit.rest.issues.create({
    owner: "xingorg1",
    repo: "leetcodeRank",
    title: getTitle(),
    body: getBody(),
  });
}


function getTitle() {
  return `【每日打卡】 ${getDate()}`;
}

function getBody() {
  return "⛽️ 加油";
}

function getDate() {
  // 运行环境是 UTC 时区
  // 需要转换成 中国时区
  // 中国时区 = UTC时区 + 8小时
  return dayjs().add("8", "hour").format("YYYY-MM-DD");
}