import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"
import geocoder from "../utils/nodeGeoCoder.js";

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler( async (req, res, next) => {

  let query;

  // Deep copy req.query
  const reqQuery = { ...req.query }

  // Remove fields
  const removeFields = ['select','sort','page','limit']

  // Loop to remove fields 
  removeFields.forEach(param => delete reqQuery[param])

  // Stringfy req.query
  let queryStr = JSON.stringify(req.query)

  // Create operators ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`)

  // Finding resources
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');


  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  
  query = query.skip(startIndex).limit(limit)
  
  // Execute the query
  const bootcamps = await query;

  // Paginate result
  const pagination = {}
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.status(200).json({ success: true, count: bootcamps.length, pagination: pagination, data: bootcamps });
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
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }

    bootcamp.remove();

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