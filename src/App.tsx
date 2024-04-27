import { useEffect, useState } from "react";
import "./App.css";
import {
  WebAppProvider,
  useExpand,
  useInitData,
} from "@zakarliuka/react-telegram-web-tools";
import {
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";

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
  const { initData, initDataUnsafe } = useInitData();
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
        {initDataUnsafe?.user?.username && (
          <h1>Welcome @{initDataUnsafe?.user?.username}</h1>
        )}

        {user && (
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {user.username ?? `#${user.tgId}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your referral code #{user.referralCode}
              </Typography>
            </CardContent>
          </Card>
        )}

        {tasks?.map((taskGroup) => (
          <Card sx={{ maxWidth: 345 }} key={taskGroup.id}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {taskGroup.name}
              </Typography>
              {taskGroup.tasks.map((task) => (
                <Card sx={{ maxWidth: 345 }} key={task.id}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {task.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {task.url}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
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
