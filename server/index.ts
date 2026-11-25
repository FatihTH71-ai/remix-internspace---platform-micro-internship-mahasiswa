import { app } from "./app";
import { closePool, execute } from "./db";
import { config } from "./config";

const server = app.listen(config.PORT, () => {
  console.info(`InternSpace API listening on http://localhost:${config.PORT}`);
});

const cleanupTimer = setInterval(() => {
  void (async () => {
    try {
      await execute("DELETE FROM sessions WHERE expires_at <= NOW()");
      await execute("DELETE FROM action_tokens WHERE expires_at <= NOW() OR used_at IS NOT NULL");
      await execute("DELETE FROM oauth_states WHERE expires_at <= NOW()");
      await execute("UPDATE users SET is_premium = FALSE WHERE is_premium = TRUE AND premium_until <= NOW()");
    } catch (error) {
      console.error("Scheduled cleanup failed:", error);
    }
  })();
}, 60 * 60 * 1000);
cleanupTimer.unref();

async function shutdown(signal: string): Promise<void> {
  console.info(`Received ${signal}; shutting down API.`);
  clearInterval(cleanupTimer);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

