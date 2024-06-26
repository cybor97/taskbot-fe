export const mockTasks = [
  {
    id: 1,
    name: "Test group 1",
    tasks: new Array(10).fill(null).map((_, taskIndex) => ({
      id: taskIndex,
      type: "default",
      name: `Test task ${taskIndex}`,
      description: `Some test task ${taskIndex}`,
      url: "https://duckduckgo.com" as string | null,
      userTasks: [
        {
          id: 1,
          reward: Math.floor(100 + Math.random() * 500),
          completed: false,
        },
      ],
    })),
  },
  {
    id: 2,
    name: "Test group 2",
    tasks: [
      {
        id: 3,
        name: "Test task 3",
        type: "default",
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

mockTasks[0].tasks[0].type = "hasWallet";
mockTasks[0].tasks[0].url = null;

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

export const mockDropAt = {
  dropAt: "2024-04-27T22:13:22.000Z",
};

export const mockReferralsLimit = {
  referralsLimit: 10,
};

export const mockTotalXP = {
  totalXp: 100,
};
