import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  use,
  useDebugValue,
  useRef,
} from "react";
import { Box, Text, Button, Data } from "grommet";
import TaskCard from "../components/TaskCard";
import "react-circular-progressbar/dist/styles.css";
import TimerHeader, { GET_TODAY } from "@/components/TimerHeader";
import { TimerContext } from "@/contexts/TimerContext";
import Timer from "@/components/Timer";
import Task from "@/types/Task";
import TaskModal from "@/components/TaskModal";
import TaskInfo from "@/components/TaskInfo";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql, useQuery, useMutation } from "@apollo/client";
import Main from "@/components/Main";
import { useRouter } from "next/router";
import { GET_TASKS_META } from "@/components/TasksHeader";

const GET_TASK = gql`
  query GetTask($id: Float!) {
    getTask(id: $id) {
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

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      name
      email
      pomoDuration
      shortDuration
      longDuration
    }
  }
`;

const COMPLETE_TASK = gql`
  mutation CompleteTask($id: Float!) {
    completeTask(id: $id) {
      id
    }
  }
`;

const ADD_POMO = gql`
  mutation AddPomo($id: Float) {
    addPomo(id: $id) {
      message
    }
  }
`;

const PomodoroTimer = () => {
  const cansave = useRef(true);
  const currentTimer = useContext(TimerContext);
  const [taskid, setaskid] = useState<number | undefined>(
    currentTimer.current.task
  );
  const { data: task } = useQuery(GET_TASK, {
    variables: { id: taskid },
    skip: taskid === undefined,
  });
  const [addPomo] = useMutation(ADD_POMO, {
    refetchQueries: [
      { query: GET_TASK, variables: { id: taskid } },
      { query: GET_TASKS_META },
      { query: GET_TODAY },
    ],
  });
  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [
      { query: GET_TASK, variables: { id: taskid } },
      { query: GET_TASKS_META },
      { query: GET_TODAY },
    ],
  });
  const { data: user } = useQuery(GET_USER);
  const [isOpen, setIsOpen] = useState(false);
  const [maxTimes, setMaxTimes] = useState([0, 0, 0]);
  const [mode, setMode] = useState<number>(() => {
    if (currentTimer.current.wasRunning) return currentTimer.current.mode;
    return 0;
  });
  const [time, setTime] = useState<number>(() => {
    if (currentTimer.current.wasRunning) return currentTimer.current.time;
    return 0;
  });
  const [pomos, setPomos] = useState<number>(() => {
    if (currentTimer.current.wasRunning) return currentTimer.current.pomos;
    return 0;
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timer;
    if (isRunning) {
      currentTimer.current.time = time;
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            setIsRunning(false);
            changeMode();
            return 0;
          }
          currentTimer.current.time = prevTime - 1;
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  useEffect(() => {
    if (user) {
      if (mode === 0)
        setTime(
          currentTimer.current.wasRunning
            ? currentTimer.current.time
            : user.getUser.pomoDuration * 60
        );
      else if (mode === 1)
        setTime(
          currentTimer.current.wasRunning
            ? currentTimer.current.time
            : user.getUser.shortDuration * 60
        );
      else
        setTime(
          currentTimer.current.wasRunning
            ? currentTimer.current.time
            : user.getUser.longDuration * 60
        );
      setMaxTimes([
        user.getUser.pomoDuration * 60,
        user.getUser.shortDuration * 60,
        user.getUser.longDuration * 60,
      ]);
    }
  }, [user]);

  const handleStart = () => {
    currentTimer.current.wasRunning = true;
    currentTimer.current.mode = mode;
    cansave.current = true;
    setIsRunning(true);
  };

  const handlePause = () => {
    currentTimer.current.wasRunning = true;
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    currentTimer.current.wasRunning = true;
    cansave.current = true;
    setTime(maxTimes[mode]);
  };

  const handleSkip = () => {
    currentTimer.current.wasRunning = true;
    cansave.current = true;
    setIsRunning(false);
    changeMode();
  };

  function changeMode() {
    if (mode === 0) {
      if (pomos < 3) {
        setMode(1);
        setTime(maxTimes[1]);
        currentTimer.current.mode = 1;
        currentTimer.current.time = maxTimes[1];
        setPomos(pomos + 1);
        currentTimer.current.pomos = pomos + 1;
        savePomo();
      } else {
        setMode(2);
        setTime(maxTimes[2]);
        setPomos(5);
        currentTimer.current.pomos = 5;
        currentTimer.current.mode = 2;
        currentTimer.current.time = maxTimes[2];
        savePomo();
      }
    } else if (mode === 1) {
      setMode(0);
      setTime(maxTimes[0]);
      currentTimer.current.mode = 0;
      currentTimer.current.time = maxTimes[0];
    } else if (mode === 2) {
      setMode(0);
      setTime(maxTimes[0]);
      setPomos(0);
      currentTimer.current.pomos = 0;
      currentTimer.current.mode = 0;
      currentTimer.current.time = maxTimes[0];
    }
  }

  function savePomo() {
    if (cansave.current) {
      console.log("saved");
      cansave.current = false;
      addPomo({ variables: { id: taskid } });
    }
  }

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  function onCancel() {
    currentTimer.current.task = undefined;
    currentTimer.current.wasRunning = false;
    currentTimer.current.mode = 0;
    currentTimer.current.time = maxTimes[0];
    currentTimer.current.pomos = 0;
    cansave.current = true;
    setIsRunning(false);
    setTime(maxTimes[0]);
    setMode(0);
    setPomos(0);
    setaskid(undefined);
  }

  function onComplete() {
    completeTask({ variables: { id: taskid } });
  }

  return (
    <Main>
      <div>
        <TimerHeader />
        <Timer
          mode={mode}
          currentTime={time}
          maxTime={maxTimes[mode]}
          isRunning={isRunning}
          onPause={handlePause}
          onStart={handleStart}
          onReset={handleReset}
          onSkip={handleSkip}
          pomos={pomos}
        />
        <Box style={{height:"200px"}}></Box>
        <Box
          style={{
            position: "fixed",
            left: "0",
            bottom: "60px",
            width: "100vw",
            padding: "0px 10px",
          }}
        >
          {task && (
            <>
              <TaskCard
                task={task.getTask}
                onExpand={openModal}
                onCancel={onCancel}
                onComplete={onComplete}
              />
              <TaskModal isOpen={isOpen} onClose={closeModal}>
                <TaskInfo task={task.getTask} onCancel={closeModal} />
              </TaskModal>
            </>
          )}
        </Box>
      </div>
    </Main>
  );
};

export default PomodoroTimer;

export const getServerSideProps = withPageAuthRequired();
