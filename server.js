import express from "express";
import dotenv from "dotenv";

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

app.get("/api/v1/bootcamp", (req, res) => {
  res.status(200).json({ success: true, message: "Show all the bootcamps" });
});

app.get("/api/v1/bootcamp/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Show ing ${id} bootcamp` });
});

app.post("/api/v1/bootcamp", (req, res) => {
  res
    .status(201)
    .json({ success: true, message: "Bootcamp has been created " });
});

app.put("/api/v1/bootcamp/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Updated ${id} bootcamp` });
});

app.delete("/api/v1/bootcamp/:id", (req, res) => {
  const { params } = req.params;
  res.status(200).json({ success: true, message: `Deleted ${id} bootcamp` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`App is running in ${process.env.NODE_ENV} mood on PORT ${PORT}`)
);
