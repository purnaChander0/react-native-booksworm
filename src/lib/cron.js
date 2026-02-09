import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET requ4est failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;

//CRON JOB EXPLANATIONM:
//Cron jobs are schedules tasks that run periodically at fixed intervals
// we want to send 1 GET request for every 14 minutes

// How to define a "Schedular"?
// you define a  schedule using a cron expression, which consists of 5 fields representing:

///! MINUTE, HOUR,DAY OF THE MONTH, MONTH , DAY OF THE WEEK
//? EXAMPLES && EXPLANTAION:

//* 14 * * * * - Every 14 minutes

//* 0 0 * * 0 - At midnight on every sunday

// * 30 3 15 * * - At 3:30 Am, on teh 15th of every month
// * 0 0 1 1 * - At midnig
// ht, on January 1st
//* 0 * * * * - Every hour
