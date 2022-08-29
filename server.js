import express from "express";
import dotenv from "dotenv";
import bootcamps from "./routes/bootcamp.js";

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`App is running in ${process.env.NODE_ENV} mood on PORT ${PORT}`)
);
