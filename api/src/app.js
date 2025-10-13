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
import homeTestimonials from "./routes/home.testimonials.js";
import projectVideos from "./routes/project.videos.js";
import homeFeatureProjects from "./routes/home.feature-projects.js";
import adminAuth from "./routes/admin.auth.js";
import adminCloudinary from "./routes/admin.uploads.cloudinary.js";
import adminProjects from "./routes/admin.projects.js";
import adminFeature from "./routes/admin.projects.feature.js";
import adminFeatureBulk from "./routes/admin.projects.feature.bulk.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/api/home", home);
app.use("/api/home/stats", homeStats);
app.use("/api/home/recent-projects", homeRecentProjects);
app.use("/api/home/feature-projects", homeFeatureProjects);
app.use("/api/home/testimonials", homeTestimonials);
app.use("/api/services", services);
app.use("/api/projects", projects);
app.use("/api/project/videos", projectVideos);
app.use("/api/contact", contact);
app.use("/api/quotations", quotations);

app.use("/api/admin/auth", adminAuth);
app.use("/api/admin/uploads/cloudinary", adminCloudinary);
app.use("/api/admin/projects", adminProjects);

app.use("/api/admin/projects", adminFeature); // /:id/feature
app.use("/api/admin/projects", adminFeatureBulk);

export default app;
