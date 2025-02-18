import cron from "node-cron";
import fs from "fs/promises";
import path from "path";

type Payment = {
  id: number;
  name: string;
  status: string;
  date: string;
  amount: number;
};

const payments = (require("../data/payments.json") || []) as Array<Payment>;
const paid = (require("../data/paid.json") || []) as Array<Payment>;

async function scheduledTask() {
  console.log("running scheduled task: ", new Date());

  try {
    const newPaidItems = payments.filter((el) => el.status === "paid");

    if (newPaidItems.length > 0) {
      newPaidItems.forEach((el) => {
        payments.splice(
          payments.findIndex((entry) => entry.status === el.status),
          1
        );
      });
    }

    console.log({ paid, newPaidItems, conact: paid.concat(newPaidItems) });

    await fs.writeFile(
      path.join(__dirname, "../", "data", "paid.json"),
      JSON.stringify(paid.concat(newPaidItems)),
      "utf-8"
    );

    await fs.writeFile(
      path.join(__dirname, "../", "data", "payments.json"),
      JSON.stringify(payments),
      "utf-8"
    );
  } catch (e) {
    console.log(`error, ${e}`);
  }

  console.log("scheduled task completed", new Date());
}

cron.schedule("*/30 * * * * *", scheduledTask);
