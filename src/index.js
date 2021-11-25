const core = require("@actions/core");
const { Octokit } = require("octokit"); // https://github.com/octokit/octokit.js
const dayjs = require("dayjs");

try {

  const token = core.getInput("token");
  const octokit = new Octokit({
    auth: token,
  });

  // https://github.com/octokit/octokit.js#rest-api
  octokit.rest.issues.create({
    owner: "xingorg1",
    repo: "leetcode-daily-practice-action",
    title: `【每日打卡】${getDate()}`,
    body: getBody(),
  }).then((res) => {
    console.log("Hello, %s", res);
  }).catch((err) => {
    console.log('每日打卡', token + '-', err);
  })

  function getBody() {
    return "加油";
  }

  function getDate() {
    // 运行环境是 UTC 时区
    // 需要转换成 中国时区
    // 中国时区 = UTC时区 + 8小时
    return dayjs().add("8", "hour").format("YYYY-MM-DD");
  }

} catch (err) {
  console.log('end-error', err);
}
