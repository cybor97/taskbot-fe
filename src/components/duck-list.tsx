import { ReactNode } from "react";
import "./duck-list.css";

export function DuckList(props: Readonly<{ children: ReactNode[] }>) {
  return <div className="duckList">{...props.children}</div>;
} 
