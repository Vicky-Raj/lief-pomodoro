import {
  Box,
  Button,
  Heading,
  Select,
  TextArea,
  Text,
  TextInput,
  DateInput,
  Form,
} from "grommet";

import { useForm } from "react-hook-form";
import Task from "@/types/Task";

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const TaskForm = ({ task, onCancel,onSubmit }: TaskFormProps) => {
  const priorityMap = ["LOW", "MID", "HIGH"];
  const form = useForm({
    defaultValues: {
      description: task ? task.description : "",
      priority: task ? task.priority : priorityMap.indexOf("LOW"),
      tomatoes: task ? task.tomatoes : 1,
      dueDate: task ? task.dueDate : new Date().toISOString(),
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const { onBlur, name } = register("dueDate");
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Box
        style={{
          width: "100%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <Heading level="3" color="brand">
          ADD TASK
        </Heading>
        <Box style={{ width: "100%", height: "100px" }}>
          <TextArea
            placeholder="Description"
            fill
            resize={false}
            {...register("description", {
              required: "Description is required",
            })}
          />
        </Box>
        <Text color="red">{errors.description?.message}</Text>
        <Text color="brand" size="small">
          PRIORITY
        </Text>
        <Select
          value={priorityMap[form.watch("priority") as number]}
          options={["HIGH", "MID", "LOW"]}
          {...register("priority", {
            valueAsNumber: true,
            onChange: ({ option }) => {
              form.setValue("priority", priorityMap.indexOf(option));
            },
          })}
        />
        <Text color="brand" size="small">
          TOMATOES
        </Text>
        <TextInput
          placeholder="No of Tomatoes"
          type="number"
          {...register("tomatoes", {
            valueAsNumber: true,
            required: "Tomatoes is required",
            validate: (value) => {
              value = +(value as string);
              return value > 0 || "Tomatoes must be greater than 0";
            },
          })}
        />
        <Text color="red">{errors.tomatoes?.message}</Text>
        <Text color="brand" size="small">
          DUE DATE
        </Text>
        <Box style={{ width: "100%", height: "40px" }}>
          <DateInput
            format="dd/mm/yyyy"
            value={form.watch("dueDate")}
            onBlur={onBlur}
            name={name}
            onChange={({ value }) => {
              form.setValue("dueDate", value as string);
            }}
          />
        </Box>
        <Box style={{flex:"1"}}></Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button label="CANCEL" primary onClick={onCancel} />
          <Button label={task ? "UPDATE":"SAVE"} primary type="submit" />
        </Box>
      </Box>
    </Form>
  );
};

export default TaskForm;
