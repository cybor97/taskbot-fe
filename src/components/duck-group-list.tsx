import { ReactNode } from "react";
import "./duck-group-list.css";

export function DuckGroupList(props: Readonly<{ children: ReactNode[] }>) {
  return <div className="duckGroupList">{...props.children}</div>;
} 
