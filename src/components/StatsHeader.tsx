import { Box, Header, Heading, Text } from "grommet";
import { Clock } from "grommet-icons";
import {gql,useQuery} from "@apollo/client";


const StatsHeader = () => {
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
        alignItems:"center",
        justifyContent:"flex-start",
        zIndex:1
      }}
    >
      <Heading color="white" size="small">
        Analytics
      </Heading>
    </Header>
  );
};

export default StatsHeader;
