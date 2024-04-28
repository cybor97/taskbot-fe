export interface TaskGroup {
  id: number;
  name: string;
  tasks: [Task];
}

export interface Task {
  id: number;
  name: string;
  description: string;
  url: string;
  userTasks: [UserTask];
}

export interface UserTask {
  id: number;
  reward: number;
  completed: boolean;
}

export interface User {
  id: number;
  tgId: string;
  tonWalletId: string | null;
  username: string;
  isActive: boolean;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}
