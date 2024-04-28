import { Typography, Chip } from "@mui/material";

import { TaskGroup } from "../types";
import { useInitData } from "@zakarliuka/react-telegram-web-tools";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    apiQuery("/tasks", initData).then(([status, data]) => {
      if (status === 200) {
        setTasks(data);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="duckPageContainer">
      <DuckPreloader loading={loading} persist={true} />
      {!loading && (
        <Typography variant="h5" className="duckTitle" fontSize={28}>
          {tasks.flatMap((taskGroup) => taskGroup.tasks).length} tasks available
        </Typography>
      )}
      {!loading && (
        <Typography variant="body2" className="duckSubtitle" fontSize={16}>
          We'll reward you immediately with points after each task completion
        </Typography>
      )}
      <DuckGroupList>
        {tasks?.map((taskGroup) => (
          <>
            <Typography variant="h5" className="duckGroupHeader">
              {taskGroup.name}
            </Typography>
            <DuckList>
              {taskGroup.tasks.map((task) => (
                <DuckListItem
                  key={task.id}
                  leftIcon={<TelegramIcon />}
                  action={<Chip label="Start" />}
                >
                  <Typography variant="body1">{task.name}</Typography>
                  <Typography variant="body2">{task.description}</Typography>
                </DuckListItem>
              ))}
            </DuckList>
          </>
        ))}
      </DuckGroupList>
    </div>
  );
}
