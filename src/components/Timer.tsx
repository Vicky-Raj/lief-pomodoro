import { Box, Text } from "grommet";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import IconButton from "./IconButton";
import {
  Close,
  PauseFill,
  PlayFill,
  Refresh,
  ChapterNext,
  Clock,
  Alarm
} from "grommet-icons";

interface TimerProps {
  currentTime: number;
  maxTime: number;
  isRunning: boolean;
  onPause: () => void;
  onStart: () => void;
  onReset: () => void;
  onSkip: () => void;
  mode: number;
  pomos: number;
}

const Timer = (props: TimerProps) => {
  const colorsName = ["brand", "green", "green"];
  const motivation = ["Keep Going", "Take a break", "Take a Long break"];
  const colors = ["#FE7B1F", "#40BA25", "#40BA25"];
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  //array with 5 elements using map

  return (
    <>
      <Box
        direction="row"
        style={{
          justifyContent: "space-between",
          padding: "0px 20px 0px 20px",
          margin: "15px 0px",
        }}
      >
        <Text color={props.mode === 0 ? "brand" : ""}>Pomodoro</Text>
        <Text color={props.mode === 1 ? "brand" : ""}>Short Break</Text>
        <Text color={props.mode === 2 ? "brand" : ""}>Long Break</Text>
      </Box>
      <Box style={{ width: 220, height: 220, margin: "50px auto 20px" }}>
        <CircularProgressbarWithChildren
          styles={buildStyles({
            pathColor: colors[props.mode],
          })}
          value={props.currentTime}
          maxValue={props.maxTime}
        >
          <Text size="xxlarge">{formatTime(props.currentTime)}</Text>
          <Text size="xsmall" color={colorsName[props.mode]}>
            {motivation[props.mode]}
          </Text>
        </CircularProgressbarWithChildren>
      </Box>
      <Box
        direction="row"
        justify="center"
        gap="10px"
        margin={{ bottom: "20px" }}
      >
        <Clock color={1 <= props.pomos && props.pomos ? "brand" : "grey"} />
        <Clock color={2 <= props.pomos && props.pomos ? "brand" : "grey"} />
        <Clock color={3 <= props.pomos && props.pomos ? "brand" : "grey"} />
        <Clock color={4 <= props.pomos && props.pomos ? "brand" : "grey"} />
        <Alarm color={5 <= props.pomos && props.pomos ? "green" : "grey"} />
      </Box>
      <Box direction="row" justify="evenly">
        <IconButton
          icon={<ChapterNext color="white" />}
          onClick={props.onSkip}
          color={colorsName[props.mode]}
        />
        <IconButton
          icon={
            props.isRunning ? (
              <PauseFill color="white" />
            ) : (
              <PlayFill color="white" />
            )
          }
          onClick={() => {
            props.isRunning ? props.onPause() : props.onStart();
          }}
          color={colorsName[props.mode]}
        />
        <IconButton
          icon={<Refresh color="white" />}
          onClick={props.onReset}
          color={colorsName[props.mode]}
        />
      </Box>
    </>
  );
};

export default Timer;
