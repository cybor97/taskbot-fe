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

export function TasksPage() {
  const { initData } = useInitData();
  const [tasks, setTasks] = useState([] as TaskGroup[]);
  const [loading, setLoading] = useState(true);
  const webApp = useWebApp();

  const getPendingTasks = () => new Set(
    JSON.parse(localStorage.getItem("tasksPending") ?? "[]"),
  );

  const tasksPending = getPendingTasks();

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
          return apiQuery(`/tasks/${uncompletedUT.id}/verify`, initData).then(
            ([status]) => {
              console.log({ status });
              if (status === 200) {
                uncompletedUT.completed = true;
                tasksPending.delete(task.id);
                localStorage.setItem(
                  "tasksPending",
                  JSON.stringify(Array.from(tasksPending)),
                );
              }
            },
          );
        })
        .filter(Boolean);

      if (promises.length > 0) {
        setLoading(true);
        setTasks([...tasks]);
        Promise.all(promises).then(() => {
          setLoading(false);
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
      if (task.url && !tasksPending.has(task.id)) {
        webApp?.openLink(task.url);
        tasksPending.add(task.id);
        localStorage.setItem(
          "tasksPending",
          JSON.stringify(Array.from(tasksPending)),
        );
      } else {
        setLoading(true);
        apiQuery(`/tasks/${uncompletedUT.id}/verify`, initData, "POST").then(
          ([status]) => {
            if (status === 200) {
              uncompletedUT.completed = true;
              tasksPending.delete(task.id);
              localStorage.setItem(
                "tasksPending",
                JSON.stringify(Array.from(tasksPending)),
              );
              setLoading(false);
            }
          },
        );
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
                    <Typography variant="body1">{task.name}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                  </DuckListItem>
                );
              })}
            </DuckList>
          </Fragment>
        ))}
      </DuckGroupList>
    </div>
  );
}
