import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

async function main() {
  const chartData = [];
  const days = await prisma.day.findMany({
    where: {
      userId: 13,
      date: {
        lte: dayjs().add(1, "day").startOf("day").toDate(),
        gte: dayjs().subtract(7, "day").startOf("day").toDate(),
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  console.log(days)
  for (let i = 0; i < 7; i++) {
    const date = dayjs()
      .subtract(7 - i - 1, "day")
      .startOf("day");
    let flag = false;
    for (let j = 0; j < days.length; j++) {
      if (dayjs(days[j].date).startOf("day").isSame(date)) {
        chartData.push({
          date: date.format("YYYY-MM-DD"),
          amount: days[j].tomatoes,
        });
        flag = true;
        break;
      }
    }
    if (!flag) {
      chartData.push({ date: date.format("YYYY-MM-DD"), amount: 0 });
    }
  }
  console.log(chartData)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
