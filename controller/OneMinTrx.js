const schedule = require("node-cron");
const {
  queryDb,
  functionToreturnDummyResult,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");
let recurstionCount = 0;
exports.generatedTimeEveryAfterEveryOneMinTRX = (io) => {
  let oneMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    console.log(timeToSend);
    io.emit("onemintrx", timeToSend);
  });
};

exports.jobRunByCrone = async () => {
  schedule.schedule("54 * * * * *", async function () {
    const actualtome = soment.tz("Asia/Kolkata");
    const time = actualtome;
    const getTime = await queryDb(
      "SELECT `utc_time` FROM `trx_UTC_timer` ORDER BY `id` DESC LIMIT 1;",
      []
    );
    let time_to_Tron = getTime?.[0]?.utc_time;
    setTimeout(async () => {
      await callTronAPISecond(time_to_Tron, time);
      recurstionCount = 0;
    }, 3000);
  });
};
//////////
async function callTronAPISecond(time_to_Tron, time) {
  await axios
    .get(
      `https://apilist.tronscanapi.com/api/block`,
      {
        params: {
          sort: "-balance",
          start: "0",
          limit: "20",
          producer: "",
          number: "",
          start_timestamp: time_to_Tron,
          end_timestamp: time_to_Tron,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "TRON-PRO-API-KEY": "afb46c26-ff95-4caf-ac0e-f303038672af",
        },
      }
    )
    .then((result) => {
      if (result?.data?.data?.[0]) {
        recurstionCount = 0;
        const obj = result?.data?.data?.[0];
        sendOneMinResultToDatabase(time, obj, time_to_Tron);
      } else {
        console.log("recursion called", time_to_Tron, result?.data?.data);
        setTimeout(async () => {
          await callTronAPISecond(time_to_Tron, time);
        }, 1500);
      }
    })
    .catch((e) => {
      console.log("error in tron api", time_to_Tron);
      if (recurstionCount <= 4) {
        setTimeout(() => {
          recurstionCount = recurstionCount + 1;
          callTronAPISecond(time_to_Tron, time);
        }, 1000);
      } else {
        console.log("else function is called", time_to_Tron);
        sendOneMinResultToDatabase(
          time,
          functionToreturnDummyResult(
            Math.floor(Math.random() * (4 - 0 + 1)) + 0
          ),
          time_to_Tron
        );
      }
    });
}
const sendOneMinResultToDatabase = async (time, obj, updatedTimestamp) => {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  const query = `CALL sp_insert_trx_one_min_result(?, ?, ?, ?, ?, ?, ?)`;
  await queryDb(query, [
    Number(num + 1),
    String(moment(time).format("HH:mm:ss")),
    1,
    `**${obj.hash.slice(-4)}`,
    JSON.stringify({ ...obj, updatedTimestamp: updatedTimestamp }),
    `${obj.hash.slice(-5)}`,
    obj.number,
  ])
    .then((result) => {})
    .catch((e) => {
      console.log(e);
    });
};
