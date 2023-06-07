import { Footer, Heading, Nav, Anchor } from "grommet";
import { History, List, BarChart, SettingsOption } from "grommet-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { TimerContext } from "@/contexts/TimerContext";

const AppFooter = () => {
  const path = useRouter().pathname.split("/")[1];
  return (
    <Nav
      direction="row"
      background="white"
      pad="medium"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid black",
        position: "fixed",
        left: "0",
        bottom: "0",
        height: "50px",
      }}
    >
      <Link href="/">
        <History color={path == "" ? "brand" : "disabled"} />
      </Link>
      <Link href="/tasks">
        <List color={path == "tasks" ? "brand" : "disabled"} />
      </Link>
      <Link href="/stats">
        <BarChart color={path == "stats" ? "brand" : "disabled"} />
      </Link>
      <Link href="/settings">
        <SettingsOption color={path == "settings" ? "brand" : "disabled"} />
      </Link>
    </Nav>
  );
};

export default AppFooter;
