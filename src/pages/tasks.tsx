import { Typography, Chip } from "@mui/material";

import { Task, TaskGroup, UserTask } from "../types";
import { useInitData, useWebApp } from "@zakarliuka/react-telegram-web-tools";
import { useEffect, useState, Fragment } from "react";
import apiQuery from "../api";
import { DuckPreloader } from "../components/duck-preloader";

import { Telegram as TelegramIcon } from "@mui/icons-material";
import { DuckList } from "../components/duck-list";
import { DuckListItem } from "../components/duck-list-item";
import { DuckGroupList } from "../components/duck-group-list";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";

export function TasksPage() {
  const { initData } = useInitData();
  const [tasks, setTasks] = useState([] as TaskGroup[]);
  const [loading, setLoading] = useState(true);

  const webApp = useWebApp();
  const rawAddress = useTonAddress(false);

  const getPendingTasks = () =>
    new Set(JSON.parse(localStorage.getItem("tasksPending") ?? "[]"));

  const tasksPending = getPendingTasks();
  const getHasWalletPending = () =>
    tasks.some((group) =>
      group.tasks.some(
        (task) => task.type === "hasWallet" && tasksPending.has(task.id),
      ),
    );

  const [hasWalletPending, setHasWalletPending] = useState(
    getHasWalletPending(),
  );

  useEffect(() => {
    apiQuery("/tasks", initData).then(([status, data]) => {
      if (status === 200) {
        setTasks(data);
      }
      setLoading(false);
    });

    const handleFocus = () => {
      const tasksPending = getPendingTasks();

      const promises = tasks
        .flatMap((group) => group.tasks)
        .map((task) => {
          if (!tasksPending.has(task.id)) {
            return null;
          }
          const uncompletedUT =
            task.userTasks.find((ut) => !ut.completed) ?? null;
          if (uncompletedUT === null) {
            return null;
          }
          return apiQuery(
            `/tasks/${uncompletedUT.id}/verify`,
            initData,
            "POST",
            { wallet_id: rawAddress },
          ).then(([status]) => {
            if (status === 200) {
              uncompletedUT.completed = true;
              tasksPending.delete(task.id);
              localStorage.setItem(
                "tasksPending",
                JSON.stringify(Array.from(tasksPending)),
              );
            }
          });
        })
        .filter(Boolean);

      if (promises.length > 0) {
        setLoading(true);
        setTasks([...tasks]);
        Promise.all(promises).then(() => {
          setLoading(false);
          setHasWalletPending(getHasWalletPending());
        });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTaskClick = (task: Task, uncompletedUT: UserTask | null) => {
    if (uncompletedUT === null) {
      return;
    }

    return () => {
      if (!tasksPending.has(task.id)) {
        if (task.url !== null) {
          webApp?.openLink(task.url);
        }
        tasksPending.add(task.id);
        if (task.type === "hasWallet") {
          setHasWalletPending(true);
        }
        localStorage.setItem(
          "tasksPending",
          JSON.stringify(Array.from(tasksPending)),
        );
      } else {
        setLoading(true);
        apiQuery(`/tasks/${uncompletedUT.id}/verify`, initData, "POST", {
          wallet_id: rawAddress,
        }).then(([status]) => {
          if (status === 200) {
            uncompletedUT.completed = true;
            tasksPending.delete(task.id);
            localStorage.setItem(
              "tasksPending",
              JSON.stringify(Array.from(tasksPending)),
            );
          }
          setHasWalletPending(false);
          setLoading(false);
        });
      }
    };
  };

  return (
    <div className="duckPageContainer">
      <DuckPreloader loading={loading} persist={true} />
      {!loading && (
        <Typography variant="h5" className="duckTitle" fontSize={28}>
          {tasks.flatMap((taskGroup) => taskGroup.tasks).length} tasks available
        </Typography>
      )}
      <Typography variant="body2" className="duckSubtitle" fontSize={16}>
        We'll reward you immediately with XP after each task completion
      </Typography>
      <DuckGroupList>
        {tasks?.map((taskGroup) => (
          <Fragment key={taskGroup.id}>
            <Typography variant="h5" className="duckGroupHeader">
              {taskGroup.name}
            </Typography>
            <DuckList>
              {taskGroup.tasks.map((task) => {
                const completed = task.userTasks.every((ut) => ut.completed);
                const uncompletedUT =
                  task.userTasks.find((ut) => !ut.completed) ?? null;
                return (
                  <DuckListItem
                    key={task.id}
                    leftIcon={<TelegramIcon />}
                    action={
                      <Chip
                        label={completed ? "Done" : "Start"}
                        color={completed ? "primary" : "default"}
                        clickable
                        onClick={handleTaskClick(task, uncompletedUT)}
                      />
                    }
                  >
                    <div className="duckTaskLabelContainer">
                      <Typography variant="body1">{task.name}</Typography>
                      <Typography
                        variant="body2"
                        className="duckRewardLabel"
                        component="a"
                        color="primary"
                      >
                        +
                        {task.userTasks.reduce((acc, ut) => acc + ut.reward, 0)}{" "}
                        XP
                      </Typography>
                    </div>
                    <Typography variant="body2">{task.description}</Typography>
                  </DuckListItem>
                );
              })}
            </DuckList>
          </Fragment>
        ))}
      </DuckGroupList>
      {hasWalletPending && (
        <TonConnectButton
          style={{ position: "fixed", bottom: 92, zIndex: 2 }}
        />
      )}
    </div>
  );
}
