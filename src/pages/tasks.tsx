import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Stack,
  Chip,
  Link,
  CircularProgress,
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { TaskGroup } from "../types";
import { useInitData } from "@zakarliuka/react-telegram-web-tools";
import { useState } from "react";
import apiQuery from "../api";

export function TasksPage() {
  const { initData } = useInitData();
  const [tasks, setTasks] = useState([] as TaskGroup[]);
  const [loading, setLoading] = useState(true);

  apiQuery("/tasks", initData).then(([status, data]) => {
    if (status === 200) {
      setTasks(data);
    }
    setLoading(false);
  });

  return (
    <div className="tasksContainer">
      {loading && <CircularProgress />}
      {tasks?.map((taskGroup) => (
        <Accordion key={taskGroup.id}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>{taskGroup.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {taskGroup.tasks.map((task) => (
              <Box key={task.id}>
                <Typography variant="body1">{task.name}</Typography>
                <Link href={task.url}>{task.name}</Link>
                <Typography variant="body2">{task.description}</Typography>
                {task.userTasks.map((userTask) => (
                  <Stack direction="row" spacing={1} key={userTask.id}>
                    {userTask.completed && <Chip label="Completed!" />}
                    {!userTask.completed && <Chip label="New!" />}
                    <Chip label={`Reward ${userTask.reward}🦆`} />
                  </Stack>
                ))}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
