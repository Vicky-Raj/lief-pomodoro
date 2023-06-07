import { Box, Button, Heading, Text } from "grommet";
import Task from "@/types/Task";
import dayjs from "dayjs";
import { wrap } from "module";
import { relative } from "path";

interface TaskInfoProps {
  task: Task;
  onEdit?: () => void;
  onCancel: () => void;
}

const TaskInfo = ({ task, onEdit, onCancel }: TaskInfoProps) => {
  const priorityMap = ["LOW", "MID", "HIGH"];
  const priorityColor = ["green", "orange", "red"];
  const day = dayjs(task.dueDate);
  const today = dayjs();
  let dueColor = "darkorange";
  if (today.startOf("day").isAfter(day.startOf("day"))) dueColor = "red";
  else if (today.startOf("day").isBefore(day.startOf("day")))
    dueColor = "green";
  return (
    <>
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          wordWrap: "break-word",
          marginBottom: "auto",
          minHeight: "415px",
        }}
      >
        <Heading level="3" color="brand">
          TASK INFO
        </Heading>
        <Text color="brand" size="small" style={{textDecoration:"underline"}}>
          CREATED ON
        </Text>
        <Text>
          {dayjs(task?.createdAt as string).format("DD/MM/YY")}
        </Text>
        <Text color="brand" size="small" style={{textDecoration:"underline"}}>
          DESCRIPTION
        </Text>
        <Text>{task?.description}</Text>
        <Text color="brand" size="small" style={{textDecoration:"underline"}}>
          PRIORITY
        </Text>
        <Text color={priorityColor[task?.priority as number]}>
          {priorityMap[task?.priority as number]}
        </Text>
        <Text color="brand" size="small" style={{textDecoration:"underline"}}>
          DUE DATE
        </Text>
        <Text color={dueColor}>
          {dayjs(task?.dueDate as string).format("DD/MM/YY")}
        </Text>
        <Text color="brand" size="small" style={{textDecoration:"underline"}}>
          TOMATOES
        </Text>
        <Text>{`${task?.pomodoros} / ${task?.tomatoes}`}</Text>
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button label="CANCEL" primary onClick={onCancel} />
        {onEdit && <Button label="EDIT" primary onClick={onEdit} />}
      </Box>
    </>
  );
};

export default TaskInfo;
