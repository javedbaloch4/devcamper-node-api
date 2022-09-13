import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"
import geocoder from "../utils/nodeGeoCoder.js";

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @route /api/v1/bootcamps?averageCost[lte]=10000&location.city=Boston
 * @access Public
 */
export const getBootcamps = asyncHandler( async (req, res, next) => {

  let query;

  let queryStr = JSON.stringify(req.query)

  queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`)

  query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await query;

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamp
 * @access Public
 */
export const createBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    if (!bootcamp) {
      return new ErrorResponse('Failed to create bootcamp', 400)
    }

    res.status(200).json({ success: true, msg: "Bootcamp has been created." });
  
});

/**
 * @desc Show a bootcamp
 * @route GET /api/v1/bootcamp/:id
 * @access Public
 */
export const showBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Update a bootcamp
 * @route PUT /api/v1/bootcamp/:id
 * @access Public
 */
export const updateBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      msg: "Data has been updated",
      data: bootcamp,
    });
});

/**
 * @desc Delete a bootcamp
 * @route DELETE /api/v1/bootcamp/:id
 * @access Public
 */
export const deleteBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }
    res.status(200).json({ success: true, msg: "Bootcamp has been deleted" })
});


/**
 * @desc Get bootcamps by radius
 * @route GET /api/v1/bootcamps/:zipcode/:distance
 * @access Public
 */

export const getBootcampsByRadius = asyncHandler ( async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get Lng, Lat from geocoder
  const loc = await geocoder.geocode(zipcode);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Get the radius
  const radius = distance / 3963;

  // Get the data with the distance
  const bootcamps = await Bootcamp.find({
    location: { 
      $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }
    }
  })

  res.status(200).json({success: true, count: bootcamps.length , data: bootcamps })
});