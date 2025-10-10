// api/dev.js
import app from "./src/app.js";

const PORT = process.env.PORT || 4000; // change if you want
app.listen(PORT, () => {
  console.log(`🚀 Local API running on http://localhost:${PORT}`);
});
