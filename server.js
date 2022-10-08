import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import fileupload from "express-fileupload"
import cookieParser from "cookie-parser"
import path from "path"
import { DBConnect } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import bootcamps from "./routes/bootcamp.js";
import courses from "./routes/courses.js";
import auth from "./routes/auth.js"
import user from "./routes/user.js"
import reviews from "./routes/reviews.js"

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Dirname path
const __dirname = path.resolve();

// Database Connection
DBConnect();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/reviews", reviews)

// Use Error handler
app.use(errorHandler);

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
