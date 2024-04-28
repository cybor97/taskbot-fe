import { Divider } from "@mui/material";
import "./duck-list-item.css";

export function DuckListItem(
  props: Readonly<{
    leftIcon: React.ReactNode;
    action: React.ReactNode;
    children: React.ReactNode[];
  }>,
) {
  const { leftIcon, action, children } = props;
  return (
    <>
      <div className="duckListItem">
        <div className="duckListItemLeftIcon">{leftIcon}</div>
        <div className="duckListItemChildren">{...children}</div>
        <div className="duckListItemAction">{action}</div>
      </div>
      <Divider />
    </>
  );
}
