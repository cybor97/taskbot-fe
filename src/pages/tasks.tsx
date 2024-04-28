import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Stack,
  Chip,
  Link,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { TaskGroup } from "../types";
import { useInitData } from "@zakarliuka/react-telegram-web-tools";
import { useEffect, useState } from "react";
import apiQuery from "../api";
import mainLogoData from "../assets/main-logo.json";
import { useLottie } from "lottie-react";

export function TasksPage() {
  const { initData } = useInitData();
  const [tasks, setTasks] = useState([] as TaskGroup[]);
  const [loading, setLoading] = useState(true);
  const lottieObj = useLottie({
    animationData: mainLogoData,
    loop: false,
    autoPlay: false,
    playsInline: false,
  });
  const { View: AnimationView } = lottieObj;

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
      <div className="duckLogo">{AnimationView}</div>
      {tasks && (
        <Typography variant="h5" className="duckTitle" fontSize={28}>
          {tasks.flatMap((taskGroup) => taskGroup.tasks).length} tasks available
        </Typography>
      )}
      {tasks && (
        <Typography variant="body2" className="duckSubtitle" fontSize={16}>
          {
            "We'll reward you immediately with points after each task completion"
          }
        </Typography>
      )}
      {loading && <CircularProgress />}
      {tasks?.map((taskGroup) => (
        <Accordion key={taskGroup.id} className="duckTaskList">
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>{taskGroup.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {taskGroup.tasks.map((task) => (
              <Container key={task.id} className="duckTaskListItem">
                <Container className="duckTaskListItem">
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
                </Container>
                <Divider />
              </Container>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
