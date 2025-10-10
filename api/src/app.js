import express from "express";
import cors from "cors";
import morgan from "morgan";
import home from "./routes/home.js";
import services from "./routes/services.js";
import projects from "./routes/projects.js";
import contact from "./routes/contact.js";
import quotations from "./routes/quotations.js";
import homeStats from "./routes/home.stats.js";
import homeRecentProjects from "./routes/home.recent-projects.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/api/home", home);
app.use("/api/home/stats", homeStats);
app.use("/api/home/recent-projects", homeRecentProjects);
app.use("/api/services", services);
app.use("/api/projects", projects);
app.use("/api/contact", contact);
app.use("/api/quotations", quotations);

export default app;
