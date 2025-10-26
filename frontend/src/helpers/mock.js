import MockAdapter from "axios-mock-adapter";

const delay = 300;

function withOk(data) {
  return [200, data];
}

function withCreated(data) {
  return [201, data];
}

export default function enableMocks(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: delay });

  // In-memory users for frontend-only auth
  const users = {
    itadmin: { password: "it@2024", role: "it" },
    storesadmin: { password: "stores@2024", role: "stores" },
    garage: { password: "garage@2024", role: "garage" },
    finance: { password: "finance@2024", role: "finance" }
  };

  // Auth: login
  mock.onPost(/\/api\/users\/login/).reply((config) => {
    try {
      const body = JSON.parse(config.data || "{}");
      const username = String(body.username || body.email || "").trim();
      const password = String(body.password || "");
      const record = users[username];
      if (record && record.password === password) {
        return withOk({
          token: `mock-jwt-${username}`,
          user: { id: Math.floor(Math.random() * 10000) + 1, username, role: record.role }
        });
      }
      return [401, { message: "Invalid credentials" }];
    } catch (e) {
      return [400, { message: "Bad request" }];
    }
  });

  // Users
  mock.onGet(/\/api\/users\/?$/).reply(() =>
    withOk([{ id: 1, username: "admin", email: "admin@moh.go.ug" }])
  );

  // Assets
  mock.onGet(/\/api\/assets\/?$/).reply(() => withOk([]));
  mock.onPost(/\/api\/assets/).reply((config) => withCreated(JSON.parse(config.data || "{}")));

  // Vehicles
  mock.onGet(/\/api\/v\/vehicle/).reply(() => withOk([]));

  // Categories
  mock.onGet(/\/api\/type/).reply(() => withOk([]));
  mock.onGet(/\/api\/brand/).reply(() => withOk([]));
  mock.onGet(/\/api\/category/).reply(() => withOk([]));

  // Fallbacks
  mock.onGet(/.*/).reply(() => withOk([]));
  mock.onPost(/.*/).reply((config) => withCreated(JSON.parse(config.data || "{}")));
}
