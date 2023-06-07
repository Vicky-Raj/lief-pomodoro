import { Box, Header, Heading, Text } from "grommet";
import { Clock } from "grommet-icons";
import {gql,useQuery} from "@apollo/client";

export const GET_TASKS_META = gql`
  query GetTasksMeta {
    getTasksMeta {
      todo,
      done
    }
  }
`;

const TasksHeader = () => {
  const { data} = useQuery(GET_TASKS_META);
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
        zIndex:1
      }}
    >
      <Heading color="white" size="small">
        TASKS
      </Heading>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: "1",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "50px",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text color="light">TODO</Text>
            <Text color="white" weight="bold" size="large">
              {data ? data.getTasksMeta.todo : 0}
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text color="light">DONE</Text>
            <Text color="white" weight="bold" size="large">
              {data ? data.getTasksMeta.done : 0}
            </Text>
          </Box>
        </Box>
      </Box>
    </Header>
  );
};

export default TasksHeader;
