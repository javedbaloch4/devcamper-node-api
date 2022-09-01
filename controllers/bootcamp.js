import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamp
 * @access Public
 */
export const createBootcamp = async (req, res, next) => {
  try {
    await Bootcamp.create(req.body);
    res.status(200).json({ success: true, msg: "Bootcamp has been created." });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc Show a bootcamp
 * @route GET /api/v1/bootcamp/:id
 * @access Public
 */
export const showBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // res.status(400).json({ success: false, error: err });
    // next(err);
    next(
      new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`, 400)
    );
  }
};

/**
 * @desc Update a bootcamp
 * @route PUT /api/v1/bootcamp/:id
 * @access Public
 */
export const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status({ success: true, data: bootcamp });
    }

    res.status(200).json({
      success: true,
      msg: "Data has been updated",
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc Delete a bootcamp
 * @route Delete /api/v1/bootcamp/:id
 * @access Public
 */
export const deleteBootcamp = async (req, res, next) => {
  try {
    await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Data has been deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};
