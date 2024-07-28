const schedule = require("node-cron");
const {
  queryDb,
  funciotnForInsertDataInTR_43,
  funciotnForInsertDataInTR_42,
  functionToUpdateTheTransId,
  functionToUpdateTheManualResult,
  functionToGetTheManualResult,
  functionToreturnDummyResult,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");

exports.generatedTimeEveryAfterEveryOneMinTRX = (io) => {
  // let isAlreadyHit = "";
  // let result = "";
  // let manual_result = "";
  try {
    // const job = schedule.schedule("* * * * * *", async function () {
    setInterval(async () => {
      const currentTime = new Date();
      const timeToSend =
        currentTime.getSeconds() > 0
          ? 60 - currentTime.getSeconds()
          : currentTime.getSeconds();
      io.emit("onemintrx", timeToSend);
      // if (timeToSend === 0) io.emit("result", result);
      if (false) {
        // timeToSend === 58
        await functionToUpdateTheManualResult([])
          .then((result) => {})
          .catch((e) => {
            console.log(e);
          });
      }
      if (false) {
        // timeToSend === 12
        const datetoAPISend = parseInt(new Date().getTime().toString());
        const actualtome = soment.tz("Asia/Kolkata");
        const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

        /////////////////////////////
        await functionToGetTheManualResult([])
          .then((result) => {
            if (result?.length > 0) {
              manual_result = result?.[0]?.tr41_packid;
            } else {
              manual_result = 0;
            }
          })
          .catch((e) => {
            console.log(e);
          });
        /////////////////////////////
        console.log(datetoAPISend, "Time to send tron api");

        try {
          datetoAPISend &&
            setTimeout(async () => {
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
                      start_timestamp: datetoAPISend,
                      end_timestamp: datetoAPISend,
                    },
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((res) => {
                  if (res?.data?.data?.[0]) {
                    const obj = res?.data?.data?.[0];
                    const fd = new FormData();
                    fd.append("hash", `**${obj?.hash.slice(-4)}`);
                    fd.append("digits", `${obj?.hash.slice(-5)}`);
                    fd.append("number", obj?.number);
                    fd.append("time", moment(time).format("HH:mm:ss"));
                    let prevalue = `${moment(time).format("HH:mm:ss")}`;
                    const newString = obj?.hash;
                    let num = null;
                    for (let i = newString?.length - 1; i >= 0; i--) {
                      if (!isNaN(parseInt(newString[i]))) {
                        num = parseInt(newString[i]);
                        break;
                      }
                    }
                    fd.append("slotid", num);
                    fd.append("overall", JSON.stringify(obj));
                    try {
                      if (String(isAlreadyHit) === String(prevalue)) return;
                      // const response = await axios.post(
                      //   "https://admin.zupeeter.com/Apitrx/insert_one_trx",
                      //   fd
                      // );
                      const newString = obj.hash;
                      let num = null;
                      for (let i = newString.length - 1; i >= 0; i--) {
                        if (!isNaN(parseInt(newString[i]))) {
                          num = parseInt(newString[i]);
                          break;
                        }
                      }
                      result = num + 1;
                      insertIntoTrxonetable(
                        manual_result,
                        time,
                        obj,
                        (err, results) => {
                          if (err) {
                            console.error("Error inserting data: ", err);
                          } else {
                            console.log(
                              "Data inserted successfully: ",
                              results
                            );
                          }
                        }
                      );
                      isAlreadyHit = prevalue;
                    } catch (e) {
                      console.log(e);
                    }
                  } else {
                    getGeneratedTronResultIfFailButRandom(
                      datetoAPISend,
                      isAlreadyHit,
                      result,
                      manual_result,
                      time
                    );
                  }
                })
                .catch((e) => {
                  console.log("error in tron api");
                  // console.log(e);
                  getGeneratedTronResultIfFailButRandom(
                    datetoAPISend,
                    isAlreadyHit,
                    result,
                    manual_result,
                    time
                  );
                });
            }, [6000]);
        } catch (e) {
          console.log(e);
        }
      }
    }, 1000);

    // });
  } catch (e) {
    console.log(e);
  }
};

exports.insertOneMinTrxResultByCron = () => {
  let isAlreadyHit = "";
  let result = "";
  let manual_result = "";
  const insert = schedule.schedule("48 * * * * *", async function () {
    const datetoAPISend = parseInt(new Date().getTime().toString());
    const actualtome = soment.tz("Asia/Kolkata");
    const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
    try {
      datetoAPISend &&
        setTimeout(async () => {
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
                  start_timestamp: datetoAPISend,
                  end_timestamp: datetoAPISend,
                },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              if (res?.data?.data?.[0]) {
                const obj = res?.data?.data?.[0];
                try {
                  insertIntoTrxonetable(
                    manual_result,
                    time,
                    obj,
                    (err, results) => {
                      if (err) {
                        console.error("Error inserting data: ", err);
                      } else {
                        console.log("Data inserted successfully: ", results);
                      }
                    }
                  );
                } catch (e) {
                  console.log(e);
                }
              } else {
                getGeneratedTronResultIfFailButRandom(
                  datetoAPISend,
                  isAlreadyHit,
                  result,
                  manual_result,
                  time
                );
              }
            })
            .catch((e) => {
              console.log("error in tron api");
              // console.log(e);
              getGeneratedTronResultIfFailButRandom(
                datetoAPISend,
                isAlreadyHit,
                result,
                manual_result,
                time
              );
            });
        }, [4000]);
    } catch (e) {
      console.log(e);
    }
  });
};

async function getGeneratedTronResultIfFailButRandom(
  datetoAPISend,
  isAlreadyHit,
  result,
  manual_result,
  time
) {
  console.log("above api is failed");
  const fd = new FormData();
  /////////////////// inbetween 0 to 4 random number //////////////////
  const obj = functionToreturnDummyResult(
    Math.floor(Math.random() * (4 - 0 + 1)) + 0
  );

  try {
    insertIntoTrxonetable(manual_result, time, obj, (err, results) => {
      if (err) {
        console.error("Error inserting data: ", err);
      } else {
        console.log("Data inserted successfully: ", results);
      }
    });
    isAlreadyHit = prevalue;
  } catch (e) {
    console.log(e);
  }
}

async function insertIntoTrxonetable(manual_result, time, obj, callback) {
  if (!obj?.hash) {
    obj = {
      hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413ddekjdsflja45",
      number: 65234895,
      size: 68325,
      timestamp: 1721285448000,
      txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
      parentHash:
        "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
      witnessId: 0,
      witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
      nrOfTrx: 283,
      nrOfTrx: 283,
      witnessName: "JD Investment",
      version: "30",
      fee: 265.16438,
      confirmed: false,
      nrOfTrx: 283,
      witnessName: "JD Investment",
      version: "30",
      nrOfTrx: 283,
      witnessName: "JD Investment",
      version: "30",
      nrOfTrx: 283,
      witnessName: "JD Investment",
      witnessName: "JD Investment",
      version: "30",
      fee: 265.16438,
      confirmed: false,
      confirmations: 3,
      netUsage: 83776,
      energyUsage: 4107654,
      blockReward: 16,
      voteReward: 160,
      revert: false,
    };
  }
  const newString =
    obj?.hash ||
    "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413ddekjdsflja45";
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  try {
    const query = `CALL sp_insert_trx_one_min_result(?,?,?,?,?,?,?);`;
    await queryDb(query, [
      Number(num + 1),
      String(moment(time).format("HH:mm:ss")),
      1,
      `**${obj?.hash?.slice(-4) || "ja45"}`,
      JSON.stringify(obj),
      `${obj?.hash.slice(-5) || "lja45"}`,
      obj?.number || 65234895,
    ])
      .then((result) => {})
      .catch((e) => {
        console.log("error in the sp_insert_trx_one_min_result");
      });
  } catch (e) {
    console.log("error in the sp_insert_trx_one_min_result");
  }
}
// async function insertIntoTrxonetable(manual_result, time, obj, callback) {
//   if (!obj?.hash) {
//     obj = {
//       hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413ddekjdsflja45",
//       number: 65234895,
//       size: 68325,
//       timestamp: 1721285448000,
//       txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
//       parentHash:
//         "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
//       witnessId: 0,
//       witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
//       nrOfTrx: 283,
//       nrOfTrx: 283,
//       witnessName: "JD Investment",
//       version: "30",
//       fee: 265.16438,
//       confirmed: false,
//       nrOfTrx: 283,
//       witnessName: "JD Investment",
//       version: "30",
//       nrOfTrx: 283,
//       witnessName: "JD Investment",
//       version: "30",
//       nrOfTrx: 283,
//       witnessName: "JD Investment",
//       witnessName: "JD Investment",
//       version: "30",
//       fee: 265.16438,
//       confirmed: false,
//       confirmations: 3,
//       netUsage: 83776,
//       energyUsage: 4107654,
//       blockReward: 16,
//       voteReward: 160,
//       revert: false,
//     };
//   }
//   const newString =
//     obj?.hash ||
//     "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413ddekjdsflja45";
//   let num = null;
//   for (let i = newString.length - 1; i >= 0; i--) {
//     if (!isNaN(parseInt(newString[i]))) {
//       num = parseInt(newString[i]);
//       break;
//     }
//   }

//   let timee = moment(time).format("HH:mm:ss");
//   let hash = `**${obj?.hash?.slice(-4) || "ja45"}`;
//   let overall = JSON.stringify(obj);
//   let trdigit = `${obj?.hash.slice(-5) || "lja45"}`;
//   let tr_number = obj?.number || 65234895;

//   ///////////////////////  update num /////////////////////

//   // Execute the query
//   const query_id =
//     "SELECT tr_tranaction_id,tr_price FROM tr_game WHERE tr_id = 1";
//   await queryDb(query_id, [])
//     .then(async (results) => {
//       //////////////// this is the way to update the transactoin id
//       await functionToUpdateTheTransId([
//         Number(results?.[0]?.tr_tranaction_id) + 1,
//         Number(results?.[0]?.tr_price) + 1,
//       ])
//         .then((result) => {})
//         .catch((e) => console.log(e));
//       ///////// now insert the data into the tr43

//       await funciotnForInsertDataInTR_43([
//         manual_result > 0 ? manual_result : num + 1,
//         timee,
//         1,
//         Number(results?.[0]?.tr_tranaction_id) + 1,
//         Number(results?.[0]?.tr_price) + 1,
//         hash,
//         overall,
//         trdigit,
//         tr_number,
//       ])
//         .then((result) => {})
//         .catch((e) => console.log(e));
//       ///////////////// now insert the data into the tr42
//       await funciotnForInsertDataInTR_42([
//         manual_result > 0 ? manual_result : num + 1,
//         timee,
//         1,
//         Number(results?.[0]?.tr_tranaction_id) + 1,
//         Number(results?.[0]?.tr_price) + 1,
//         hash,
//         overall,
//         trdigit,
//         tr_number,
//       ])
//         .then((result) => {})
//         .catch((e) => console.log(e));
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// }
