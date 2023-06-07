import TaskCard from "@/components/TaskCard";
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
  Collapsible,
  Spinner,
} from "grommet";
import { use, useContext, useEffect, useRef, useState } from "react";
import TasksHeader, { GET_TASKS_META } from "@/components/TasksHeader";
import TaskForm from "@/components/TaskForm";
import TaskInfo from "@/components/TaskInfo";
import TaskModal from "@/components/TaskModal";
import Task from "@/types/Task";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Main from "@/components/Main";
import { gql, useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { FilterContext } from "@/contexts/FilterContext";
import { useRouter } from "next/router";
import { TimerContext } from "@/contexts/TimerContext";
import { Filter } from "grommet-icons";

const ADD_TASK = gql`
  mutation AddTask(
    $tomatoes: Float!
    $priority: Float!
    $dueDate: String!
    $description: String!
  ) {
    addTask(
      tomatoes: $tomatoes
      priority: $priority
      dueDate: $dueDate
      description: $description
    ) {
      tomatoes
      priority
      dueDate
      description
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: Float!
    $tomatoes: Float!
    $priority: Float!
    $dueDate: String!
    $description: String!
  ) {
    updateTask(
      id: $id
      tomatoes: $tomatoes
      priority: $priority
      dueDate: $dueDate
      description: $description
    ) {
      tomatoes
      priority
      dueDate
      description
    }
  }
`;

const GET_TASKS = gql`
  query GetTasks($sort: String!, $show: String!, $order: String!) {
    getTasks(sort: $sort, show: $show, order: $order) {
      description
      dueDate
      id
      pomodoros
      priority
      remaining
      tomatoes
      createdAt
      completed
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: Float!) {
    deleteTask(id: $id) {
      message
    }
  }
`;

interface TasksQuery {
  getTasks: Task[];
}

const Tasks = () => {
  const router = useRouter();
  const filter = useContext(FilterContext);
  const timer = useContext(TimerContext);
  const [updmodalIsOpen, setIsOpenupd] = useState(false);
  const [newModalIsOpen, setIsOpennew] = useState(false);
  const [show, setShow] = useState(filter.current.show);
  const [sort, setSort] = useState(filter.current.sort);
  const [order, setOrder] = useState(filter.current.order);
  const [isEdit, setisEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const currentTask = useRef<number>(0);
  const { refetch, data: tasks } = useQuery<TasksQuery>(GET_TASKS, {
    fetchPolicy: "network-only",
    variables: { sort: sort, show: show, order: order },
  });
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [
      { query: GET_TASKS, variables: { sort: sort, show: show, order: order } },
      { query: GET_TASKS_META },
    ],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      { query: GET_TASKS, variables: { sort: sort, show: show, order: order } },
      { query: GET_TASKS_META },
    ],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [
      { query: GET_TASKS, variables: { sort: sort, show: show, order: order } },
      { query: GET_TASKS_META },
    ],
  });

  function closeModalupd() {
    setisEdit(false);
    setIsOpenupd(false);
  }

  function handleExpansion(id: number) {
    currentTask.current = id;
    setIsOpenupd(true);
  }

  function handeleEdit() {
    setisEdit(true);
  }

  function openModalnew() {
    setIsOpennew(true);
  }

  function closeModalnew() {
    setIsOpennew(false);
  }

  function onCreate(data: Task) {
    addTask({
      variables: {
        ...data,
      },
    });
    closeModalnew();
  }

  function onUpdate(data: Task) {
    updateTask({
      variables: {
        id: tasks?.getTasks[currentTask.current].id,
        ...data,
      },
    });
    closeModalupd();
  }

  function startPomo(id: number) {
    timer.current.wasRunning = false;
    timer.current.mode = 0;
    timer.current.time = 0;
    timer.current.task = id;
    timer.current.pomos = 0;
    router.push({ pathname: "/" }, { pathname: "/" }, { shallow: false });
  }

  function onDelete(id: number) {
    if (id === timer.current.task) {
      timer.current.wasRunning = false;
      timer.current.mode = 0;
      timer.current.time = 0;
      timer.current.task = undefined;
      timer.current.pomos = 0;
    }
    deleteTask({
      variables: {
        id: id,
      },
    });
  }

  useEffect(() => {
    refetch({ sort: sort, show: show, order: order });
  }, [sort, show, order]);

  return (
    <Main>
      <TasksHeader />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          gap: "10px",
        }}
      >
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          onClick={() => setShowFilter(!showFilter)}
        >
          <Filter /> Filter
        </Button>
        <Collapsible open={showFilter}>
          <Text color="brand" size="small">
            SHOW
          </Text>
          <Select
            options={["All", "Completed", "Todo", "Overdue"]}
            value={show}
            onChange={({ value }) => {
              setShow(value as string);
              filter.current.show = value as string;
            }}
          />
          <Text color="brand" size="small">
            SORT BY
          </Text>
          <Select
            options={["Priority", "Reamining", "Due", "Pomodoros", "Created"]}
            value={sort}
            onChange={({ value }) => {
              setSort(value as string);
              filter.current.sort = value as string;
            }}
          />
          <Text color="brand" size="small">
            ORDER
          </Text>
          <Select
            options={["ASC", "DESC"]}
            value={order}
            onChange={({ value }) => {
              setOrder(value as string);
              filter.current.order = value as string;
            }}
          />
        </Collapsible>
        <Button color="brand" label="ADD TASK" primary onClick={openModalnew} />
        {tasks ? (
          tasks.getTasks.map((task: Task, i: number) => (
            <TaskCard
              task={task}
              onExpand={() => handleExpansion(i)}
              key={task.id}
              onDelete={onDelete}
              onComplete={() => startPomo(task.id as number)}
            />
          ))
        ) : (
          <Box justify="center" direction="row">
            <Spinner />
          </Box>
        )}
        <TaskModal isOpen={updmodalIsOpen} onClose={closeModalupd}>
          {isEdit ? (
            <TaskForm
              onCancel={closeModalupd}
              onSubmit={onUpdate}
              task={tasks?.getTasks[currentTask.current] as Task}
            />
          ) : (
            <TaskInfo
              task={tasks?.getTasks[currentTask.current] as Task}
              onEdit={handeleEdit}
              onCancel={closeModalupd}
            />
          )}
        </TaskModal>
        <TaskModal isOpen={newModalIsOpen} onClose={closeModalnew}>
          <TaskForm onCancel={closeModalnew} onSubmit={onCreate} />
        </TaskModal>
        <Box style={{ width: "100%", height: "60px" }}></Box>
      </Box>
    </Main>
  );
};

export default Tasks;

export const getServerSideProps = withPageAuthRequired();
