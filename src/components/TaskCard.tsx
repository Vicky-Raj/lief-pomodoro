import { Box, Button, Card, Text } from "grommet";
import {
  StatusGood,
  Trash,
  Alarm,
  Close,
  StatusGoodSmall,
  CheckboxSelected,
  Checkbox,
} from "grommet-icons";
import Task from "@/types/Task";
import dayjs from "dayjs";

interface TaskCardProps {
  task: Task;
  onExpand: () => void;
  onCancel?: () => void;
  onDelete?: (id: number) => void;
  onComplete?: () => void;
}

export const TaskCard = ({
  task,
  onExpand,
  onCancel,
  onComplete,
  onDelete,
}: TaskCardProps) => {
  const priorityText = ["LOW", "MID", "HIGH"];
  const priorityColor = ["green", "orange", "red"];
  const day = dayjs(task.dueDate);
  const today = dayjs();
  let dueColor = "darkorange";
  if (today.startOf("day").isAfter(day.startOf("day"))) dueColor = "red";
  else if (today.startOf("day").isBefore(day.startOf("day")))
    dueColor = "green";
  return (
    <Card
      background="light-1"
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100px",
        border: "1px solid #eeeeee",
        padding: "5px",
      }}
    >
      <Box
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          whiteSpace: "nowrap",
          overflow: "hidden",
          padding: "0px 10px",
        }}
        onClick={onExpand}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Text
            weight="bold"
            size="small"
            color="brand"
            style={{ flexGrow: "1" }}
          >
            TASK
          </Text>
          <Text size="small">
            <Text color="brand" weight="bold" size="small">
              DUE:{" "}
            </Text>
            <Text color={dueColor} weight="bold" size="small">
              {dayjs(task.dueDate).format("DD/MM/YYYY")}
            </Text>
          </Text>
        </Box>

        <Text>{task.description}</Text>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Text size="small" style={{ flexGrow: "1" }}>
              <Text color="brand" weight="bold" size="small">
                TOMATOES:
              </Text>{" "}
              <Text  weight="bold" size="small">
                {`${task.pomodoros} / ${task.tomatoes}`}
              </Text>
            </Text>
            <Text
              size="small"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <Text color="brand" weight="bold" size="small">
                PRIORITY:
              </Text>
              <Text
                color={priorityColor[task.priority as number]}
                weight="bold"
                size="small"
              >
                {priorityText[task.priority as number]}
              </Text>
            </Text>
          </Box>
        </Box>
      </Box>
      <Box
        style={{
          alignSelf: "flex-end",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {onCancel ? (
          <>
            <Button
              onClick={onComplete}
              icon={<StatusGood color={task?.completed ? "green" : "gold"} />}
            />
            <Button onClick={onCancel} icon={<Close color="red" />} />
          </>
        ) : (
          <>
            <Button
              onClick={onComplete}
              icon={<StatusGood color={task?.completed ? "green" : "gold"} />}
            />
            <Button
              onClick={onDelete ? () => onDelete(task?.id as number) : () => {}}
              icon={<Trash color="red" />}
            />
          </>
        )}
      </Box>
    </Card>
  );
};

export default TaskCard;
