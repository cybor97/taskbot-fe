import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "../types";
import apiQuery from "../api";
import { useInitData } from "@zakarliuka/react-telegram-web-tools";
import Avatar from "react-avatar";

export function HomePage() {
  const { initData, initDataUnsafe } = useInitData();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null as User | null);

  useEffect(() => {
    apiQuery("/me", initData).then(([status, data]) => {
      if (status === 200) {
        setUser(data);
      }
      setLoading(false);
    });
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
      {loading && <CircularProgress />}
      {user && <Avatar name={avatarName ?? "D"} round />}
      {user && (
        <Typography variant="h5" className="duckTitle" fontSize={28}>
          {user.username}
        </Typography>
      )}
      {user && (
        <Typography variant="body2" className="duckSubtitle" fontSize={16}>
          {user.createdAt}
        </Typography>
      )}
      {user && (
        <Typography variant="body2" className="duckSubtitle" fontSize={16}>
          {user.referralCode}
        </Typography>
      )}
    </div>
  );
}
