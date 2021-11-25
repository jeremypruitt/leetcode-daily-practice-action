const core = require("@actions/core");
const { Octokit } = require("octokit");
const dayjs = require("dayjs");


const token = core.getInput("token");
const octokit = new Octokit({
  auth: token,
});

octokit.rest.issues.create({
  owner: "xingorg1",
  repo: "leetcode-daily-practice-action",
  title: `【每日打卡】 ${ getDate() }`,
  body: getBody(),
});

function getBody() {
  return "加油";
}

function getDate() {
  // 运行环境是 UTC 时区
  // 需要转换成 中国时区
  // 中国时区 = UTC时区 + 8小时
  return dayjs().add("8", "hour").format("YYYY-MM-DD");
}