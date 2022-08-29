import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Show all the bootcamps" });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Show ing ${id} bootcamp` });
});

router.post("/", (req, res) => {
  res
    .status(201)
    .json({ success: true, message: "Bootcamp has been created " });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Updated ${id} bootcamp` });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Deleted ${id} bootcamp` });
});

export default router;
