import Bootcamp from "../models/Bootcamp.js";

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: "Show " });
};

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamp
 * @access Public
 */
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc Show a bootcamp
 * @route GET /api/v1/bootcamp/:id
 * @access Public
 */
export const showBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Show ing ${id} bootcamp` });
};

/**
 * @desc Update a bootcamp
 * @route PUT /api/v1/bootcamp/:id
 * @access Public
 */
export const updateBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Updated ${id} bootcamp` });
};

/**
 * @desc Delete a bootcamp
 * @route Delete /api/v1/bootcamp/:id
 * @access Public
 */
export const deleteBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Deleted ${id} bootcamp` });
};
