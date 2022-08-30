import express from "express";
import dotenv from "dotenv";
import bootcamps from "./routes/bootcamp.js";
import morgan from "morgan";
import { DBConnect } from "./config/db.js";

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Database Connection
DBConnect();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `App is running in ${process.env.NODE_ENV} mood on PORT ${PORT}`.yellow.bold
  )
);

// Hanlde Unhandled Promise Rejection Warning
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
