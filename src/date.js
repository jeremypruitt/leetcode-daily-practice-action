const dayjs = require("dayjs");
/**
 * 运行环境是 UTC 时区
 * 需要转换成 中国时区
 * 中国时区 = UTC时区 + 8小时
 */
const getUTCtime = () => {
  let time = dayjs().add("8", "hour")
  console.log('getUTCtime', time)
  return time
}

const getDate = () => {
  let time = getUTCtime().format("YYYY-MM-DD");
  console.log('getDate', time);
  return time
}

const getDayDiff = () => {
  let time = getUTCtime().diff('2021-11-10', 'day') + 1
  console.log('getDayDiff', time);
  return time
}
module.exports = {
  getUTCtime,
  getDate,
  getDayDiff
}