import Main from "@/components/Main";
import SettingsHeader from "@/components/SettingsHeader";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, Box, Button, Form, Text, TextInput } from "grommet";
import { useForm } from "react-hook-form";
import { GET_USER } from "./index";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useEffect, useContext } from "react";
import { TimerContext } from "@/contexts/TimerContext";
import { useRouter } from "next/router";

const UPDATE_DURATION = gql`
  mutation UpdateDuration($pomo: Float!, $short: Float!, $long: Float!) {
    updateDuration(pomo: $pomo, short: $short, long: $long) {
      message
    }
  }
`;

export default function Settings() {
  const { user: profile } = useUser();
  const { data: user } = useQuery(GET_USER);
  const router = useRouter();
  const timer = useContext(TimerContext);
  const [updateDuration] = useMutation(UPDATE_DURATION, {
    refetchQueries: [{ query: GET_USER }],
  });
  const form = useForm({
    defaultValues: {
      shortBreak: 1,
      longBreak: 1,
      pomoDuration: 1,
    },
  });
  useEffect(() => {
    if (user) {
      form.setValue("shortBreak", user.getUser.shortDuration);
      form.setValue("longBreak", user.getUser.longDuration);
      form.setValue("pomoDuration", user.getUser.pomoDuration);
    }
  }, [user]);
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: any) => {
    timer.current.wasRunning = false;
    timer.current.mode = 0;
    timer.current.time = 0;
    timer.current.task = undefined;
    timer.current.pomos = 0;
    updateDuration({
      variables: {
        pomo: data.pomoDuration,
        short: data.shortBreak,
        long: data.longBreak,
      },
    });
  };
  const logout = () => {
    router.push("/api/auth/logout");
  };
  return (
    <Main>
      <SettingsHeader />
      <Box
        style={{
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <Box
          direction="column"
          justify="center"
          align="center"
          style={{ flex: "1" }}
          gap="10px"
        >
          <Avatar src={profile?.picture as string} size="150px" />
          <Text size="large">{profile?.name}</Text>
        </Box>
        <Form
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Text color="brand" size="small">
            POMODORO DURATION
          </Text>
          <TextInput
            placeholder="POMODORO DURATION"
            type="number"
            {...register("pomoDuration", {
              valueAsNumber: true,
              required: "POMODORO DURATION is required",
              validate: (value) => {
                value = Number(value);
                return value > 1 || "POMODORO DURATION must be greater than 1";
              },
            })}
          />
          <Text color="red">{errors.pomoDuration?.message}</Text>
          <Text color="brand" size="small">
            SHORT BREAK DURATION
          </Text>
          <TextInput
            placeholder="SHORT BREAK DURATION"
            type="number"
            {...register("shortBreak", {
              valueAsNumber: true,
              required: "SHORT BREAK DURATION is required",
              validate: (value) => {
                value = Number(value);
                return (
                  value > 1 || "SHORT BREAK DURATION must be greater than 1"
                );
              },
            })}
          />
          <Text color="red">{errors.shortBreak?.message}</Text>
          <Text color="brand" size="small">
            LONG BREAK DURATION
          </Text>
          <TextInput
            placeholder="LONG BREAK DURATION"
            type="number"
            {...register("longBreak", {
              valueAsNumber: true,
              required: "LONG BREAK DURATION is required",
              validate: (value) => {
                value = Number(value);
                return (
                  value > 0 || "LONG BREAK DURATION must be greater than 1"
                );
              },
            })}
          />
          <Text color="red">{errors.longBreak?.message}</Text>
          <Button
            label="SAVE"
            primary
            type="submit"
            style={{ marginTop: "10px" }}
          />
        </Form>
        <Box
          direction="column"
          justify="center"
          style={{ flex: "1" }}
          align="center"
        >
          <Button label="LOGOUT" primary color="red" onClick={logout} />
        </Box>
      </Box>
    </Main>
  );
}

export const getServerSideProps = withPageAuthRequired();
