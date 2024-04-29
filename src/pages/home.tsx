import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "../types";
import apiQuery from "../api";
import { useInitData } from "@zakarliuka/react-telegram-web-tools";
import Avatar from "react-avatar";
import { DuckPreloader } from "../components/duck-preloader";

export function HomePage() {
  const { initData, initDataUnsafe } = useInitData();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null as User | null);
  const [dropAt, setDropAt] = useState(null as Date | null);
  const [xp, setXP] = useState(null as number | null);

  useEffect(() => {
    Promise.all([
      apiQuery("/me", initData).then(([status, data]) => {
        if (status === 200) {
          setUser(data);
        }
      }),
      apiQuery("/dropat", initData).then(([status, data]) => {
        if (status === 200 && data !== null && data.dropAt !== null) {
          setDropAt(new Date(data.dropAt));
        }
      }),
      apiQuery("/xp", initData).then(([status, data]) => {
        if (status === 200 && data !== null && data.dropAt !== null) {
          setXP(data.totalXp);
        }
      }),
    ]).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let avatarName = user ? user.username ?? user.tgId : null;
  const firstName = initDataUnsafe?.user?.first_name ?? null;
  if (firstName !== null) {
    const lastName = initDataUnsafe?.user?.last_name ?? null;
    avatarName = `${firstName} ${lastName}`;
  }
  return (
    <div className="duckPageContainer">
      <DuckPreloader loading={loading} persist={false} />
      {user && (
        <>
          <Avatar
            name={avatarName ?? "D"}
            className="duckAvatar"
            color="#ffa000"
            round={true}
          />
          <Typography variant="h5" className="duckTitle" fontSize={28}>
            {user.username ? `@${user.username}` : `#${user.tgId}`}
          </Typography>
          <div className="duckXPContainer">
            <Typography
              variant="h5"
              className="duckXP"
              color={xp !== null ? "primary" : "default"}
            >
              XP {xp ?? "Calculating..."}
            </Typography>
          </div>
        </>
      )}
      {dropAt && (
        <Typography variant="body2">
          Drop at: {dropAt.toDateString()}
        </Typography>
      )}
    </div>
  );
}
