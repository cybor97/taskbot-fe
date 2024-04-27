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
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";

import mainLogoData from "./assets/main-logo.json";
import { useLottie } from "lottie-react";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [theme, setTheme] = useState(defaultTheme);
  const { initData, initDataUnsafe } = useInitData();
  const [, expand] = useExpand();

  const lottieObj = useLottie({
    animationData: mainLogoData,
    loop: false,
    autoPlay: false,
    playsInline: false,
  });
  const { View: AnimationView } = lottieObj;

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
    console.log({ initData, initDataUnsafe });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WebAppProvider>
        <div>{AnimationView}</div>

        {initDataUnsafe?.user?.username && (
          <h1>Welcome @${initDataUnsafe?.user?.username}</h1>
        )}

        <div className="card">
          <button
            onClick={() => {
              setCount((count) => count + 1);
              if (lottieObj.animationItem?.isPaused) {
                lottieObj.goToAndPlay(0);
              }
            }}
          >
            Clicker test {count}
          </button>
          <button
            onClick={() => {
              fetch(`https://duckbot.earlgreyvpn.com/api/test?${initData}`)
                .then((res) => res.json())
                .then((data) => {
                  console.log({ data });
                  setApiResponse(data);
                });
            }}
          >
            API test
          </button>
          <Typography>{JSON.stringify({ apiResponse })}</Typography>
        </div>
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
