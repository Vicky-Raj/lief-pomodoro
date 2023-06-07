import { Box, Header, Heading, Text } from "grommet";


const SettingsHeader = () => {
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
        Settings
      </Heading>
    </Header>
  );
};

export default SettingsHeader;
