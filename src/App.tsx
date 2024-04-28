import { useEffect, useState } from "react";
import "./App.css";
import {
  WebAppProvider,
  useExpand,
} from "@zakarliuka/react-telegram-web-tools";
import {
  BottomNavigation,
  BottomNavigationAction,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { TasksPage } from "./pages/tasks";
import { ReferralPage } from "./pages/referral";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(defaultTheme);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WebAppProvider>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/tasks" Component={TasksPage} />
          <Route path="/referral" Component={ReferralPage} />
        </Routes>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="/"
            onClick={() => navigate("/")}
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Tasks"
            value="/tasks"
            onClick={() => navigate("/tasks")}
            icon={<TaskIcon />}
          />
          <BottomNavigationAction
            label="Frens"
            value="/referral"
            onClick={() => navigate("/referral")}
            icon={<PeopleIcon />}
          />
        </BottomNavigation>
      </WebAppProvider>
    </ThemeProvider>
  );
}

export default App;
