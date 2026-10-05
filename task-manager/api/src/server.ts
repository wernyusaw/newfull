import cors from "cors";
import express from "express";
import healthRoutes from "./domains/tasks/routes/health/health.routes.js";
import taskRoutes from "./domains/tasks/routes/tasks/tasks.routes.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.listen(port, () => {
  console.log(`Task Manager API listening on http://localhost:${port}`);
});