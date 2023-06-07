import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";
import { Box, Header, Heading, Text } from "grommet";
import { Clock } from "grommet-icons";

export const GET_TODAY = gql`
  query GetToday {
    getToday {
      id
      done
      focusTime
      tomatoes
    }
  }
`;

const AppHeader = () => {
  const { data: today } = useQuery(GET_TODAY);
  let focustime = [0, 0];
  if (today) {
    focustime = [
      Math.floor(today.getToday.focusTime / 60),
      today.getToday.focusTime % 60,
    ];
  }
  return (
    <Header
      background="brand"
      style={{
        height: "100px",
        borderBottom: "1px solid black",
        display: "flex",
        flexDirection: "row",
        padding: "0px 20px",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
      }}
    >
      <Clock color="white" style={{ width: "40px", height: "40px" }} />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: "1",
        }}
      >
        <Box style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ flexGrow: "1" }} color="white" weight="bold">
            TODAY
          </Text>
          <Text color="light">{dayjs().format("DD/MM/YY ddd")}</Text>
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "20px",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text color="light" style={{ textDecoration: "underline" }}>
              DONE
            </Text>
            <Text color="white" weight="bold" size="large">
              {today ? today.getToday.done : 0}
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text color="light" style={{ textDecoration: "underline" }}>
              TOMATO
            </Text>
            <Text color="white" weight="bold" size="large">
              {today ? today.getToday.tomatoes : 0}
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text color="light" style={{ textDecoration: "underline" }}>
              FOCUS TIME
            </Text>
            <Text color="white">
              {focustime[0] > 0 ? (
                <>
                  <Text size="large" weight="bold">
                    {focustime[0]}
                  </Text>
                  <Text size="xsmall">h</Text>
                </>
              ) : null}
              <Text size="large" weight="bold">
                {" "}
                {focustime[1]}
              </Text>
              <Text size="xsmall">m</Text>
            </Text>
          </Box>
        </Box>
      </Box>
    </Header>
  );
};

export default AppHeader;
