const express = require("express");
const app = express();
const config = require("./config");
const connectDB = require("./config/db");
const swapRoutes = require("./routes/swapRoutes");
const priceRoutes = require("./routes/priceRoutes");
const liquidityRoutes = require("./routes/liquidityRoutes");
const cors = require("cors");
const logger = require("./utils/logger");

// connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/swap", swapRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/pair", liquidityRoutes);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
