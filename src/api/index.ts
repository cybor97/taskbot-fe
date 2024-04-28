import {
  mockDropAt,
  mockReferralsLimit,
  mockTasks,
  mockTotalXP,
  mockUser,
} from "./mocks";

export default async function apiQuery(endpoint: string, initData?: string) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  if (apiUrl === "test") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockData(endpoint);
  }

  return fetch(`${apiUrl}${endpoint}?${initData}`).then((response) =>
    Promise.all([response.status, response.json()]),
  );
}

function mockData(endpoint: string) {
  switch (endpoint) {
    case "/tasks":
      return [200, mockTasks];
    case "/me":
      return [200, mockUser];
    case "/dropat":
      return [200, mockDropAt];
    case "/referrals_limit":
      return [200, mockReferralsLimit];
    case "/xp":
      return [200, mockTotalXP];
    default:
      return [404, "Not Found"];
  }
}
