import http from "node:http";
import { spawn } from "node:child_process";

const appHost = "127.0.0.1";
const appPort = 3000;
const readyPort = 3210;
const baseUrl = `http://${appHost}:${appPort}`;

const routesToWarm = [
  "/",
  "/client",
  "/clients",
  "/clients/new",
  "/invitations/internal",
  "/members",
  "/portfolio",
  "/invite/expired",
];

const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--webpack",
    "-H",
    appHost,
    "-p",
    String(appPort),
  ],
  {
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  },
);

let shuttingDown = false;

const fetchWithTimeout = async (url, timeoutMs = 90_000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`${url} returned HTTP ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

const waitForApp = async () => {
  const deadline = Date.now() + 90_000;
  const initialCompileTimeoutMs = 30_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      await fetchWithTimeout(`${baseUrl}/`, initialCompileTimeoutMs);
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw lastError ?? new Error("Next.js dev server did not become ready.");
};

const createReadinessServer = () =>
  http.createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("ready");
  });

const shutdown = (server) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  server?.close();

  if (!child.killed) {
    child.kill();
  }
};

try {
  await waitForApp();

  for (const route of routesToWarm) {
    await fetchWithTimeout(`${baseUrl}${route}`);
  }

  const server = createReadinessServer();
  server.listen(readyPort, appHost, () => {
    console.log(
      `Playwright web server ready after warming ${routesToWarm.length} routes.`,
    );
  });

  process.on("SIGINT", () => shutdown(server));
  process.on("SIGTERM", () => shutdown(server));

  child.on("exit", (code, signal) => {
    server.close();

    if (!shuttingDown) {
      process.exitCode = code ?? (signal ? 1 : 0);
    }
  });
} catch (error) {
  console.error(error);
  shutdown();
  process.exitCode = 1;
}
