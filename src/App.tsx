import { useEffect, useState } from "react";
import "./App.css";
import {
  WebAppProvider,
  useExpand,
  useInitData,
} from "@zakarliuka/react-telegram-web-tools";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface TaskGroup {
  id: number;
  name: string;
  tasks: [
    {
      id: number;
      name: string;
      description: string;
      url: string;
      userTasks: [{ id: number; reward: number; completed: boolean }];
    },
  ];
}

interface User {
  id: number;
  tgId: string;
  tonWalletId: string | null;
  username: string;
  isActive: boolean;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [value, setValue] = useState(0);
  const [tasks, setTasks] = useState([] as TaskGroup[]);
  const [user, setUser] = useState(null as User | null);
  const [apiResponse, setApiResponse] = useState(null);
  const [theme, setTheme] = useState(defaultTheme);
  const { initData } = useInitData();
  const [, expand] = useExpand();

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          mode: window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
            ? "dark"
            : "light",
        },
      }),
    );
    expand();
    fetch(`https://duckbot.earlgreyvpn.com/api/tasks?${initData}`)
      .then((response) => Promise.all([response.status, response.json()]))
      .then(([status, data]) => {
        if (status === 200) {
          setTasks(data);
        } else {
          setApiResponse(data);
        }
      });
    fetch(`https://duckbot.earlgreyvpn.com/api/me?${initData}`)
      .then((response) => Promise.all([response.status, response.json()]))
      .then(([status, data]) => {
        if (status === 200) {
          setUser(data);
        } else {
          setApiResponse(data);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WebAppProvider>
        {user && (
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h1" component="div">
                Welcome {user.username ?? `#${user.tgId}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your referral code #{user.referralCode}
              </Typography>
            </CardContent>
          </Card>
        )}

        <div className="tasksContainer">
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

        <Typography>{JSON.stringify({ apiResponse }, null, 2)}</Typography>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Tasks" icon={<TaskIcon />} />
          <BottomNavigationAction label="Frens" icon={<PeopleIcon />} />
        </BottomNavigation>
      </WebAppProvider>
    </ThemeProvider>
  );
}

export default App;
