export const mockTasks = [
  {
    id: 1,
    name: "Test group 1",
    tasks: [
      {
        id: 1,
        name: "Test task 1",
        description: "Some test task 1",
        url: "https://duckduckgo.com",
        userTasks: [
          {
            id: 1,
            reward: 100,
            completed: false,
          },
        ],
      },
      {
        id: 2,
        name: "Test task 2",
        description: "Some test task 2",
        url: "https://duckduckgo.com",
        userTasks: [
          {
            id: 2,
            reward: 200,
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Test group 2",
    tasks: [
      {
        id: 3,
        name: "Test task 3",
        description: "Some test task 3",
        url: "https://duckduckgo.com",
        userTasks: [
          {
            id: 3,
            reward: 150,
            completed: false,
          },
        ],
      },
    ],
  },
];

export const mockUser = {
  id: 2,
  tgId: "568766184",
  tonWalletId: null,
  username: "Cyborg97",
  isActive: true,
  referralCode: "NiceSnakesDrum1hsgptf73",
  createdAt: "2024-04-27T22:13:22.282Z",
  updatedAt: "2024-04-27T22:13:22.282Z",
};
