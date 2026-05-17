import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = (port, attempt = 0) => new Promise((resolve, reject) => {
  const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
    resolve(server);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;

      if (attempt >= 5) {
        reject(new Error(`Port ${port} is already in use and no fallback port was available.`));
        return;
      }

      console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
      resolve(startServer(nextPort, attempt + 1));
      return;
    }

    reject(error);
  });
});

const start = async () => {
  try {
    await connectDB();
    await startServer(Number(env.port));
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
