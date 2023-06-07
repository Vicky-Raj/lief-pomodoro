import { Box, Grommet, Header, grommet as grommetTheme } from "grommet";
import { deepMerge } from "grommet/utils";
import AppFooter from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const myCustomTheme = deepMerge(grommetTheme, {
    button: {
      primary: {
        extend: `color: white;`,
      },
    },
    global: {
      colors: {
        brand: "#FE7B1F",
        light: "#eeeeee",
        disabled: "#D3D3D3",
        green: "#40BA25",
      },
      font: {
        family: "Roboto",
      },
    },
  });

  return (
    <>
      <Grommet theme={myCustomTheme}>
        <Box style={{ width: "100%", paddingTop: "100px" }}>{children}</Box>
      </Grommet>
    </>
  );
}
