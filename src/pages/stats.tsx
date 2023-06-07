import Main from "@/components/Main";
import StatsHeader from "@/components/StatsHeader";
import { GET_TODAY } from "@/components/TimerHeader";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Card, DataChart, Text } from "grommet";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const GET_WEEK = gql`
  query GetWeek {
    getWeek {
      id
      done
      focusTime
      tomatoes
      date
    }
  }
`;

const Stats = () => {
  const [hydrate, setHydrate] = useState(false);
  const { data: today } = useQuery(GET_TODAY);
  const { data: week } = useQuery(GET_WEEK);
  let chartData = [];
  useEffect(() => {
    setHydrate(true);
  }, []);

  let todayFocus = [0, 0];
  if (today) {
    todayFocus = [
      Math.floor(today.getToday.focusTime / 60),
      today.getToday.focusTime % 60,
    ];
  }
  let weekDone = 0;
  let weekTomatoes = 0;
  let weekFocus = [0, 0];
  if (week) {
    let weekFocusmin = 0;
    week.getWeek.forEach((day: any) => {
      weekDone += day.done;
      weekTomatoes += day.tomatoes;
      weekFocusmin += day.focusTime;
    });
    const days = week.getWeek;
    weekFocus = [Math.floor(weekFocusmin / 60), weekFocusmin % 60];
    for (let i = 0; i < 7; i++) {
      const date = dayjs()
        .subtract(7 - i - 1, "day")
        .startOf("day");
      let flag = false;
      for (let j = 0; j < days.length; j++) {
        if (dayjs(days[j].date).isSame(date)) {
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
  }
  console.log(chartData);
  console.log(today)
  console.log(week)
  return (
    <Main>
      <StatsHeader />
      <Box
        style={{
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <Box
          style={{
            flex: "2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ width: "100%" }}
            color="brand"
            weight="bold"
            size="large"
          >
            TODAY
          </Text>
          <Card
            background="light-1"
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100px",
              border: "1px solid #eeeeee",
              padding: "5px",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text color="brand">DONE</Text>
              <Text weight="bold" size="large">
                {today ? today.getToday.done : 0}
              </Text>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text color="brand">TOMATO</Text>
              <Text weight="bold" size="large">
                {today ? today.getToday.tomatoes : 0}
              </Text>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text color="brand">FOCUS TIME</Text>
              <Text>
                {todayFocus[0] > 0 ? (
                  <>
                    <Text size="large" weight="bold">
                      {todayFocus[0]}
                    </Text>
                    <Text size="xsmall">h</Text>
                  </>
                ) : null}
                <Text size="large" weight="bold">
                  {" "}
                  {todayFocus[1]}
                </Text>
                <Text size="xsmall">m</Text>
              </Text>
            </Box>
          </Card>
        </Box>
        <Box
          style={{
            flex: "2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ width: "100%" }}
            color="brand"
            weight="bold"
            size="large"
          >
            WEEK
          </Text>
          <Card
            background="light-1"
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100px",
              border: "1px solid #eeeeee",
              padding: "5px",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text color="brand">DONE</Text>
              <Text weight="bold" size="large">
                {weekDone}
              </Text>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text color="brand">TOMATO</Text>
              <Text weight="bold" size="large">
                {weekTomatoes}
              </Text>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text color="brand">FOCUS TIME</Text>
              <Text>
                {weekFocus[0] > 0 ? (
                  <>
                    <Text size="large" weight="bold">
                      {weekFocus[0]}
                    </Text>
                    <Text size="xsmall">h</Text>
                  </>
                ) : null}
                <Text size="large" weight="bold">
                  {" "}
                  {weekFocus[1]}
                </Text>
                <Text size="xsmall">m</Text>
              </Text>
            </Box>
          </Card>
        </Box>
        <Box
          style={{
            flex: "4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <Text
            style={{
              width: "100%",
              marginBottom: "15px",
              alignSelf: "flex-start",
            }}
            color="brand"
            weight="bold"
            size="large"
            textAlign="start"
          >
            CHART
          </Text>
          {hydrate && (
            <DataChart
              data={chartData}
              series={["date", "amount"]}
              chart={{
                property: "amount",
                color: "brand",
                thickness: "medium",
              }}
              guide={{ y: { granularity: "fine" } }}
            />
          )}
        </Box>
      </Box>
    </Main>
  );
};
export default Stats;

export const getServerSideProps = withPageAuthRequired();
